// Browser Speech Synthesis Engine (Personalized Voice Coach)
export class VoiceCoach {
  private enabled: boolean = true;
  private name: string = 'Satya';
  private rate: number = 1.0;
  private pitch: number = 1.05;

  private quotes: string[] = [
    'Good {name}, nice! Consistency is your superpower.',
    'Nice job {name}! That brings you closer to your 1-month sprint goal.',
    'Good {name}, nice! Small daily wins build massive results.',
    'Way to go {name}! Discipline turns vision into reality.',
    'Boom! Excellent focus {name}. Keep this momentum going!',
    'Good {name}, nice! Target completed!',
  ];

  public configure(config: { enabled?: boolean; name?: string; rate?: number; pitch?: number }) {
    if (config.enabled !== undefined) this.enabled = config.enabled;
    if (config.name !== undefined && config.name.trim()) this.name = config.name.trim();
    if (config.rate !== undefined) this.rate = config.rate;
    if (config.pitch !== undefined) this.pitch = config.pitch;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public speak(text: string) {
    if (!this.enabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    // Cancel any overlapping utterance to keep it snappy
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    // Find smooth natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.lang.startsWith('en')) &&
        v.lang.startsWith('en')
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  // Called when a task is checked off
  public speakTaskCompletion(taskTitle: string, customQuote?: string) {
    if (!this.enabled) return;

    if (customQuote && customQuote.trim()) {
      const formatted = customQuote.replace(/{name}/gi, this.name);
      this.speak(formatted);
      return;
    }

    const randomTemplate = this.quotes[Math.floor(Math.random() * this.quotes.length)];
    const message = randomTemplate.replace(/{name}/g, this.name);
    this.speak(message);
  }

  // Called when full 100% of day is achieved
  public speakDayGoalAchieved() {
    if (!this.enabled) return;
    const message = `Incredible performance ${this.name}! You finished every single task today! Keep dominating your goals!`;
    this.speak(message);
  }

  // Test button preview
  public testPreview(name: string) {
    const previewName = name || this.name;
    this.speak(`Good ${previewName}, nice! Your voice coach is active and ready to keep you disciplined!`);
  }
}

export const voiceCoach = new VoiceCoach();

