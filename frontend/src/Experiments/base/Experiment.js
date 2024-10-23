export class Experiment {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.state = {
      status: 'INITIALIZING',
      currentTrial: 0,
      totalTrials: 0,
      trialProgress: []
    };
  }

  initialize(config) {
    this.config = {
      ...this.getDefaultConfig(),
      ...config
    };
    this.state.totalTrials = this.config.numTrials;
    this.state.status = 'READY';
  }

  getDefaultConfig() {
    return {
      numTrials: 1,
      interTrialDelay: 1000
    };
  }

  startTrial() {
    this.state.status = 'RUNNING';
    return this.generateTrial();
  }

  generateTrial() {
    throw new Error('generateTrial must be implemented by child class');
  }

  handleResponse(response) {
    if (this.validateResponse(response)) {
      this.state.trialProgress.push({
        trial: this.state.currentTrial,
        response,
        timestamp: Date.now()
      });
      this.endTrial();
    }
  }

  validateResponse(response) {
    throw new Error('validateResponse must be implemented by child class');
  }

  endTrial() {
    this.state.currentTrial += 1;
    if (this.state.currentTrial >= this.state.totalTrials) {
      this.complete();
    }
  }

  complete() {
    this.state.status = 'COMPLETE';
    return this.getResults();
  }

  getResults() {
    return {
      experimentId: this.id,
      trials: this.state.trialProgress,
      config: this.config
    };
  }
}
