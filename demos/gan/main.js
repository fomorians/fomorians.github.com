(function(){
  const ENDPOINT = 'placeholder.com'; // Model App URL

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
      this.get_image_el = document.getElementById('get_image');
      this.var_1_el = document.getElementById('var_1');
      this.var_2_el = document.getElementById('var_2');
      this.decrease_z_el = document.getElementById('decrease_z');
      this.increase_z_el = document.getElementById('increase_z');
    }

    start() {
      // Generate random Z vector
      // Query Model API
      // Set 'display_image' from returned querey
      // Connect other returned images to 'var_1', 'var_2', 'decrease_z', 'increase_z'
    }
  }

  const app = new App();
  app.start();
}).call(this);