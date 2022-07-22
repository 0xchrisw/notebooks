//requiring path and fs modules
const path = require('path');
const fs = require('fs');



let App = (() => {

  return new class {
    constructor() {
      this.manpagesPath = path.join(__dirname, `../data/manpages`);
      this.index    = 0;
      this.manpages = fs.readdirSync(this.manpagesPath);

      this.data = {
        text: '',
        entities: []
      }
      this.entities = [];

      this.text_display = document.getElementById('text');

      this.addEventListeners();
      this.render();
    }

    addEventListeners() {
      //
      document.getElementById('label').addEventListener('click', () => {
        let entity = window.getSelection().toString();
        this.label_info(entity);
      })
      //
      document.getElementById('next').addEventListener('click', () => {
        this.next();
      });
      //
      document.getElementById('submit').addEventListener('click', () => {
        this.submit();
      })
      //
      document.getElementById('save').addEventListener('click', () => {
        this.save();
      })
      //
      this.text_display.addEventListener('keydown', (event) => {
        const keyName = event.key;
        if (keyName === 'l') {
          event.preventDefault();
          let entity = window.getSelection().toString();
          this.label_info(entity);
        }
        if (keyName === 's') {
          event.preventDefault();
          this.submit();
        }
        if (keyName === 'Enter') {
          event.preventDefault();
          this.save();
        }
      });
    }

    render() {
      let manpage     = this.manpages[this.index];
      let manpagePath = path.join(this.manpagesPath, manpage);
      this.data.text  = fs.readFileSync(manpagePath, 'utf8')
      this.text_display.innerHTML = this.data.text;
    }

    label_info(selection) {
      let text    = this.data.text;
      let i       = -1;
      this.entities = [];

      while((i=text.indexOf(selection,i+1)) >= 0) {
        this.entities.push([i, i+selection.length]);
      }
      this.text_display.focus();
    }

    submit() {
      let label_text  = document.getElementById('label-text');

      this.entities.forEach((entity) => {
        this.data.entities.push(
          [label_text.value, entity[0], entity[1]]
        );
      })
      this.entities = [];
      // label_text.value = '';
    }

    save() {
      let data = JSON.stringify(this.data);
      let manpage = this.manpages[this.index];
      let manpagePath = path.join(this.manpagesPath, `../json/${manpage}.json`);
      fs.writeFileSync(manpagePath, data);
    }

    next() {
      this.data = {
        text: '',
        entities: []
      }
      this.index = (this.index + 1) % this.manpages.length;
      this.render();
    }

  }
})();

console.log(App);
App.render();



// syntax: command -(options) argument1 argument2 ...
// Command
// Option
// Argument
// Switches

// ("Walmart is a leading e-commerce company", {"entities": [(0, 7, "ORG")]}),

