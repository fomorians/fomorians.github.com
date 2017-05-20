(function(){
  const BASEURL = 'https://storage.googleapis.com/gansdemo/samples/'; // image base - 0_0.png
  var SAMPLE = 0;
  var INTERP_NUM = 5;

  function fetchImages(z_vec_list) {
    return fetch(`${ENDPOINT}`, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        z : z_vec_list
      })
    })
    .then(res => res.json()) // Placeholder - adjust when return is known
    .then(data => data['predictions'][0]['outputs']); // Placeholder - adjust when return is known
  }

  class App {
    constructor() {
      this.display_image_el = document.getElementById('display_image');
      this.classify_image_el = document.getElementById('classify_image');
      this.var_1_el = document.getElementById('var_1');
      this.var_2_el = document.getElementById('var_2');
      this.decrease_z_el = document.getElementById('decrease_z');
      this.increase_z_el = document.getElementById('increase_z');
      this.restore_image_el = document.getElementById('restore_image');
      this.interp_label_el = document.getElementById('interp_label');


      this.classify_image_el.addEventListener('click', this.start.bind(this));
      this.restore_image_el.addEventListener('click', this.restoreImage.bind(this));

      this.var_1_el.addEventListener('change', this.toggleFirstVar.bind(this));
      this.var_2_el.addEventListener('change', this.toggleSecondVar.bind(this));

      this.increase_z_el.addEventListener('click', this.increase_interp.bind(this));
      this.decrease_z_el.addEventListener('click', this.decrease_interp.bind(this));

    }

    restoreImage() {
      this.display_image_el.src=BASEURL+SAMPLE+"_0.png";
      INTERP_NUM = 5;
      this.interp_label_el.innerHTML=(INTERP_NUM+1)+" of 12";
    }

    toggleFirstVar() {
      if(this.display_image_el.src==BASEURL+SAMPLE+"_1.png") {
        this.display_image_el.src=BASEURL+SAMPLE+"_2.png"
      } else {
        this.display_image_el.src=BASEURL+SAMPLE+"_1.png"
      }
    }

    toggleSecondVar() {
      if(this.display_image_el.src==BASEURL+SAMPLE+"_3.png") {
        this.display_image_el.src=BASEURL+SAMPLE+"_4.png"
      } else {
        this.display_image_el.src=BASEURL+SAMPLE+"_3.png"
      }
    }

    increase_interp() {
      if(INTERP_NUM < 11){
        INTERP_NUM++;
        this.display_image_el.src=BASEURL+SAMPLE+"_interp_"+INTERP_NUM+".png";
      }
      this.interp_label_el.innerHTML=(INTERP_NUM+1)+" of 12";
    }

    decrease_interp() {
      if(INTERP_NUM > 0){
        INTERP_NUM--;
        this.display_image_el.src=BASEURL+SAMPLE+"_interp_"+INTERP_NUM+".png";
      }
      this.interp_label_el.innerHTML=(INTERP_NUM+1)+" of 12";
    }

    start() {
      SAMPLE = Math.floor(Math.random()*10);
      this.restoreImage()
    }
  }

  const app = new App();
  app.start();
}).call(this);