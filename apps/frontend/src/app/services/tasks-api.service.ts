import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { Task } from '../components/tasks-table/tasks-table';

export interface CreateTaskRequest {
  taskId: string;
  answer: string;
}

export interface WebSocketMessage {
  event: string;
  taskId: string;
  data: {
    new: Partial<Task>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TasksApiService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'https://3wi511nd5l.execute-api.eu-central-1.amazonaws.com/tasks';
  private readonly websocketUrl = 'wss://gdz9fe6zra.execute-api.eu-central-1.amazonaws.com/dev';

  private websocket: WebSocket | null = null;

  /**
   * Fetch all tasks from the API
   */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  /**
   * Create a new task
   */
  createTask(taskData: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, taskData);
  }

  /**
   * Initialize WebSocket connection for real-time updates
   */
  initializeWebSocket(
    onMessage: (message: WebSocketMessage) => void,
    onError?: (error: Event) => void
  ): void {
    try {
      this.websocket = new WebSocket(this.websocketUrl);

      this.websocket.onopen = () => {
        console.log('WebSocket connected successfully');
      };

      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Parsed WebSocket data:', data);

          if (data.event === 'taskUpdated') {
            onMessage(data);
          }
        } catch (error) {
          console.log('Non-JSON WebSocket message:', event.data);
        }
      };

      this.websocket.onclose = (event) => {
        console.log('WebSocket disconnected:', event);
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) {
          onError(error);
        }
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }



  /**
   * Close WebSocket connection
   */
  closeWebSocket(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }



  /**
   * Check if WebSocket is connected
   */
  isWebSocketConnected(): boolean {
    return this.websocket?.readyState === WebSocket.OPEN;
  }
}
