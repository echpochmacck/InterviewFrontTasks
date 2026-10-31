class Emitter {
  on(key, fn) {
    if (this.box[key]) {
      this.box[key].push(fn);
    } else {
      this.box[key] = [fn];
    }
    return () => this.off(key, fn);
  }
  off(key, fn) {
    if (this.box[key]) {
      const index = this.box[key].findIndex((val) => val === fn);
      if (index > -1) {
        this.box[key].splice(index, 1);
      }
    }
  }
  emit(key, ...args) {
    if (this.box[key]) {
    const copy = [...this.bokpk[key]]
     copy.forEach((fn) => {
        fn(...args);
      });
    }
  }
  box = {};
}

const emitter = new Emitter();
emitter.on("login", (name) => console.log("привет,", name));
emitter.on("login", (name) => console.log("загружаю данные для", name));

emitter.emit("login", "Ann");
