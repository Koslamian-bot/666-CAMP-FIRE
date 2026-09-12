import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { RoomState } from '../types/game';

type StateCallback = (state: RoomState) => void;
type EventCallback = (event: { type: string; data: any; timestamp: number }) => void;

class CampfireWebSocket {
  private client: Client | null = null;
  private currentRoomCode: string | null = null;
  private stateSub: any = null;
  private eventSub: any = null;
  private stateListeners: Set<StateCallback> = new Set();
  private eventListeners: Set<EventCallback> = new Set();

  connect(roomCode: string) {
    if (this.client?.active && this.currentRoomCode === roomCode) {
      return;
    }

    if (this.client) {
      this.disconnect();
    }

    this.currentRoomCode = roomCode;
    const wsUrl = import.meta.env.VITE_WS_URL || '/ws-campfire';

    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 3000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (msg) => {
        if (import.meta.env.DEV) {
          console.debug('[WS]', msg);
        }
      },
    });

    this.client.onConnect = () => {
      console.log('Connected to Campfire WebSocket broker for room:', roomCode);
      this.subscribeToRoom(roomCode);
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers['message'], frame.body);
    };

    this.client.activate();
  }

  private subscribeToRoom(roomCode: string) {
    if (!this.client || !this.client.connected) return;

    // Room state stream
    this.stateSub = this.client.subscribe(`/topic/room/${roomCode}`, (message) => {
      try {
        const state: RoomState = JSON.parse(message.body);
        this.stateListeners.forEach((cb) => cb(state));
      } catch (e) {
        console.error('Failed to parse room state update', e);
      }
    });

    // Special event stream (e.g. spinner animation trigger)
    this.eventSub = this.client.subscribe(`/topic/room/${roomCode}/events`, (message) => {
      try {
        const event = JSON.parse(message.body);
        this.eventListeners.forEach((cb) => cb(event));
      } catch (e) {
        console.error('Failed to parse event update', e);
      }
    });
  }

  onStateChange(callback: StateCallback): () => void {
    this.stateListeners.add(callback);
    return () => this.stateListeners.delete(callback);
  }

  onEvent(callback: EventCallback): () => void {
    this.eventListeners.add(callback);
    return () => this.eventListeners.delete(callback);
  }

  disconnect() {
    if (this.stateSub) this.stateSub.unsubscribe();
    if (this.eventSub) this.eventSub.unsubscribe();
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
    this.currentRoomCode = null;
  }
}

export const campfireWs = new CampfireWebSocket();
