export type VibeType = 'turnt' | 'decent' | 'chill';

export interface VibeConfiguration {
  filter: string;
  overlayColor: string;
  badge: string;
  prompt: string;
  hashtags: string[];
}

export const getVibeConfig = (venueName: string): Record<VibeType, VibeConfiguration> => ({
  turnt: {
    filter: 'sepia(0.3) saturate(1.8) hue-rotate(350deg) brightness(1.1)',
    overlayColor: 'rgba(255, 59, 31, 0.25)',
    badge: 'Turnt',
    prompt: 'Get Turnt! 🎉',
    hashtags: ['#TurntUpAt' + venueName.replace(/\s+/g, ''), '#VibeCheck', '#TurntUp', '#PartyMode']
  },
  decent: {
    filter: 'sepia(0.4) saturate(1.3) hue-rotate(280deg) brightness(1.05)',
    overlayColor: 'rgba(180, 122, 255, 0.25)',
    badge: 'Decent',
    prompt: 'Keep it Decent 😎',
    hashtags: ['#DecentNight', '#VibeCheck', '#GoodTimes', '#TurntUpAt' + venueName.replace(/\s+/g, '')]
  },
  chill: {
    filter: 'sepia(0.2) saturate(1.1) hue-rotate(180deg) brightness(0.95)',
    overlayColor: 'rgba(75, 213, 255, 0.25)',
    badge: 'Chill',
    prompt: 'Just Chill 😌',
    hashtags: ['#ChillScene', '#VibeCheck', '#ChillVibes', '#TurntUpAt' + venueName.replace(/\s+/g, '')]
  }
});