// Voximplant service with lazy loading
type VoximplantStatus = 'uninitialized' | 'loading' | 'ready' | 'error';

class VoximplantService {
  private static instance: VoximplantService | null = null;
  private status: VoximplantStatus = 'uninitialized';
  private client: any = null;

  private constructor() {}

  static getInstance(): VoximplantService {
    if (!VoximplantService.instance) {
      VoximplantService.instance = new VoximplantService();
    }
    return VoximplantService.instance;
  }

  async loadSDK(): Promise<void> {
    if (this.status === 'ready' || this.status === 'loading') {
      return;
    }

    if (window.VoxImplant) {
      this.status = 'ready';
      return;
    }

    this.status = 'loading';

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.voximplant.com/edge/voximplant.min.js';
      script.async = true;
      script.onload = () => {
        if (window.VoxImplant) {
          this.status = 'ready';
          resolve();
        } else {
          this.status = 'error';
          reject(new Error('VoxImplant SDK failed to load'));
        }
      };
      script.onerror = () => {
        this.status = 'error';
        reject(new Error('Failed to load VoxImplant SDK'));
      };
      document.head.appendChild(script);
    });
  }

  getClient(): any {
    if (!window.VoxImplant) {
      throw new Error('VoximplantService not initialized');
    }
    if (!this.client) {
      this.client = window.VoxImplant.getInstance();
    }
    return this.client;
  }

  getStatus(): VoximplantStatus {
    return this.status;
  }
}

export const voximplantService = VoximplantService.getInstance();

