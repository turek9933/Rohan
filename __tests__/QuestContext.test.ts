import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QuestProvider, useQuestContext } from '@/context/QuestContext';
import { useAuthContext } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';
import { addQuestToFirebase, getQuestsByUser } from '@/api/questApi';
import { User } from 'firebase/auth';


jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);


jest.mock('@/context/AuthContext');
jest.mock('@react-native-async-storage/async-storage');
jest.mock('@react-native-community/netinfo');
jest.mock('@/api/questApi');

const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>;
const mockAsyncStorageGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;
const mockAsyncStorageSetItem = AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>;
const mockNetInfoAddEventListener = NetInfo.addEventListener as jest.MockedFunction<typeof NetInfo.addEventListener>;
const mockGetQuestsByUser = getQuestsByUser as jest.MockedFunction<typeof getQuestsByUser>;
const mockAddQuestToFirebase = addQuestToFirebase as jest.MockedFunction<typeof addQuestToFirebase>;

const mockUser: Partial<User> = { 
  uid: 'test-user-id',
  email: 'test@example.com',
  emailVerified: true,
  isAnonymous: false,
  metadata: {} as any,
  providerData: [],
  refreshToken: 'mock-refresh-token',
  tenantId: null,
  delete: jest.fn(),
  getIdToken: jest.fn(),
  getIdTokenResult: jest.fn(),
  reload: jest.fn(),
  toJSON: jest.fn(),
  displayName: null,
  phoneNumber: null,
  photoURL: null,
  providerId: 'firebase'
};

const mockAuthContext = {
  user: mockUser as User,
  loading: false,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn()
};

const mockNetInfoState: NetInfoState = {
  type: NetInfoStateType.wifi,
  isConnected: true,
  isInternetReachable: true,
  details: {
    isConnectionExpensive: false,
    ssid: 'mock-wifi',
    bssid: 'mock-bssid',
    strength: 100,
    ipAddress: '192.168.1.1',
    subnet: '255.255.255.0',
    frequency: 2400,
    linkSpeed: null,
    rxLinkSpeed: null,
    txLinkSpeed: null,
  }
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  React.createElement(QuestProvider, null, children)
);

describe('QuestContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseAuthContext.mockReturnValue(mockAuthContext);
    mockAsyncStorageGetItem.mockResolvedValue(null);
    mockAsyncStorageSetItem.mockResolvedValue();
    mockNetInfoAddEventListener.mockReturnValue(() => {});
    mockGetQuestsByUser.mockResolvedValue([]);
  });

  it('loads quests from Firebase', async () => {
    const quests = [{ 
      title: 'Test Quest', 
      description: 'Test description',
      metadata: { 
        id: '1', 
        status: false,
        startDate: new Date(),
        deadline: new Date(),
        reward: 100
      },
      subQuests: []
    }];
    
    mockGetQuestsByUser.mockResolvedValue(quests);

    const { result } = renderHook(() => useQuestContext(), { wrapper });
    
    await waitFor(() => {
      expect(result.current).toBeDefined();
      expect(result.current!.Quests).toEqual(quests);
    }, { timeout: 1500 });

    expect(mockGetQuestsByUser).toHaveBeenCalledWith('test-user-id');
  });

  it('adds quest online', async () => {
    mockAddQuestToFirebase.mockResolvedValue('firebase-id');
    
    const { result } = renderHook(() => useQuestContext(), { wrapper });
    
    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    const questData = { 
      title: 'New Quest', 
      description: 'Quest description',
      metadata: { 
        status: false,
        startDate: new Date(),
        deadline: new Date(),
        reward: 100
      },
      subQuests: []
    };

    await act(async () => {
      await result.current!.addQuest(questData);
    });

    expect(mockAddQuestToFirebase).toHaveBeenCalledWith({
      ...questData,
      ownerId: 'test-user-id'
    });
    
    expect(result.current!.Quests).toHaveLength(1);
    expect(result.current!.Quests[0].title).toBe('New Quest');
  });

  it('does not add quest if no user', async () => {
    mockUseAuthContext.mockReturnValue({ 
      ...mockAuthContext, 
      user: null 
    });
    
    const { result } = renderHook(() => useQuestContext(), { wrapper });
    
    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    const questData = { 
      title: 'New Quest', 
      description: 'Quest description',
      metadata: { 
        status: false,
        startDate: new Date(),
        deadline: new Date(),
        reward: 100
      },
      subQuests: []
    };

    await act(async () => {
      await result.current!.addQuest(questData);
    });

    expect(result.current!.Quests).toHaveLength(0);
    expect(mockAddQuestToFirebase).not.toHaveBeenCalled();
  });

  it('handles offline mode correctly', async () => {
    const offlineState: NetInfoState = {
      ...mockNetInfoState,
      isConnected: false
    };
    
    mockNetInfoAddEventListener.mockImplementation((callback) => {
      callback(offlineState);
      return () => {};
    });

    const { result } = renderHook(() => useQuestContext(), { wrapper });
    
    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    expect(result.current!.isOnline).toBe(false);
  });

  it('toggles quest status', async () => {
    const initialQuests = [{
      title: 'Test Quest',
      description: 'Test description', 
      metadata: { 
        id: 'quest-1', 
        status: false,
        startDate: new Date(),
        deadline: new Date(),
        reward: 100
      },
      subQuests: []
    }];
    
    mockGetQuestsByUser.mockResolvedValue(initialQuests);
    
    const { result } = renderHook(() => useQuestContext(), { wrapper });
    
    await waitFor(() => {
      expect(result.current).toBeDefined();
      expect(result.current!.Quests).toHaveLength(1);
    });

    await act(async () => {
      result.current!.toggleQuestStatus('quest-1');
    });

    expect(result.current!.Quests[0].metadata.status).toBe(true);
  });

  it('removes quest', async () => {
    const initialQuests = [{
      title: 'Test Quest',
      description: 'Test description',
      metadata: { 
        id: 'quest-1', 
        status: false,
        startDate: new Date(),
        deadline: new Date(),
        reward: 100
      },
      subQuests: []
    }];
    
    mockGetQuestsByUser.mockResolvedValue(initialQuests);
    
    const { result } = renderHook(() => useQuestContext(), { wrapper });
    
    await waitFor(() => {
      expect(result.current).toBeDefined();
      expect(result.current!.Quests).toHaveLength(1);
    });

    await act(async () => {
      result.current!.removeQuest('quest-1');
    });

    expect(result.current!.Quests).toHaveLength(0);
  });

  it('calculates completed quests count correctly', async () => {
    const quests = [
      {
        title: 'Completed Quest',
        description: 'Test',
        metadata: { 
          id: '1', 
          status: true,
          startDate: new Date(),
          deadline: new Date(),
          reward: 100
        },
        subQuests: []
      },
      {
        title: 'Incomplete Quest',
        description: 'Test',
        metadata: { 
          id: '2', 
          status: false,
          startDate: new Date(),
          deadline: new Date(),
          reward: 100
        },
        subQuests: []
      }
    ];
    
    mockGetQuestsByUser.mockResolvedValue(quests);
    
    const { result } = renderHook(() => useQuestContext(), { wrapper });
    
    await waitFor(() => {
      expect(result.current).toBeDefined();
      expect(result.current!.completedQuestsCount).toBe(1);
      expect(result.current!.totalQuestsCount).toBe(2);
    });
  });
});