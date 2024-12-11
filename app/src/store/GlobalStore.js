import { makeAutoObservable } from 'mobx';

class GlobalStore {
  constructor() {
    makeAutoObservable(this)
  }

  user = {
    email: '',
    id: '',
    apikey: '',
    photo: '',
  }
  token = ''

  alert = {
    message: '',
    type: 'success'
  }

  syncs = []
  data = []
  webhooks = []
  sources = []
  platforms = []
  projects = []
  platform = { id: '', name: '', type: '', meta: {} }
  project = {
    name: '',
    description: '',
    prompt: {
      persona: '',
      intro: '',
      outro: ''
    }
  }


  updateGlobal = (k, v) => this[k] = v;
  update = (k, v) => this[k] = v;
  _alert = (message, type = 'success', length = 3000) => {
    this.alert.message = message;
    this.alert.type = type
    return setTimeout(() => {
      if (!this.alert) this.alert = { message: "", type: "success" }
      this.alert.message = "";
      // this.alert.type = ""
    }, length)
  }
}

export default GlobalStore;
