(function() {
  const ENDPOINT = 'https://babi-164320.appspot.com/predict';

  const TASKS = {
    'qa1': 'tasks/qa1_single-supporting-fact.json'
  };

  const QUERY_TEMPLATES = {
    'qa1': _.template('Where is <%= name %>?')
  };

  const ANSWER_TEMPLATES = {
    'qa1': _.template('The <%= location %>.')
  };
  
  const NAMED_ENTITIES = [
    'antoine', 'bernhard', 'bill', 'brian', 'daniel',
    'emily', 'fred', 'gertrude', 'greg', 'jason',
    'jessica', 'john', 'julie', 'julius', 'lily',
    'mary', 'sandra', 'sumit', 'winona', 'yann'
  ];

  const PAD_TOKEN = '_PAD';
  const PAD_ID = 0;

  function tokenize(str, vocab) {
    str = str.toLowerCase();
    str = str.replace('.', ' .');
    str = str.replace('?', ' ?');
    arr = str.split(' ');
    return arr.map(token => {
      let token_id = vocab.indexOf(token);
      if (token_id === -1) {
        return PAD_ID;
      }
      return token_id;
    });
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function contains(arr, val) {
    return arr.indexOf(val) !== -1;
  }

  function getNamedEntities(sentences, vocab) {
    let named_entities = [];
    for (let i = 0; i < sentences.length; i++) {
      let sentence = sentences[i];
      for (let j = 0; j < sentence.length; j++) {
        let token_id = sentence[j];
        if (token_id === PAD_ID) {
          continue;
        }
        let token = vocab[token_id];
        if (contains(NAMED_ENTITIES, token)) {
          named_entities.push(capitalize(token));
        }
      }
    }
    return _.unique(named_entities);
  }

  function stringify(sentences, vocab) {
    let tokens = [];
    for (let i = 0; i < sentences.length; i++) {
      let sentence = sentences[i];
      let sentence_tokens = [];
      for (let j = 0; j < sentence.length; j++) {
        let token_id = sentence[j];
        let token = vocab[token_id];
        if (token === PAD_TOKEN) {
          continue;
        }
        if (contains(NAMED_ENTITIES, token)) {
          token = capitalize(token);
        }
        sentence_tokens.push(token);
      }
      if (sentence_tokens.length > 0) {
        sentence_tokens = sentence_tokens.join(' ');
        sentence_tokens = sentence_tokens.replace(' .', '.');
        sentence_tokens = sentence_tokens.replace(' ?', '?');
        sentence_tokens = capitalize(sentence_tokens);
        tokens.push(sentence_tokens);
      }
    }
    return tokens.join('\n');
  }

  function padTo(sentence, max_sentence_length) {
    while (sentence.length < max_sentence_length) {
      sentence.push(PAD_ID);
    }
    return sentence;
  }

  function fetchTask(task_path) {
    return fetch(task_path).then(res => res.json());
  }

  function fetchAnswer(task_id, story, query) {
    return fetch(`${ENDPOINT}/${task_id}`, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        story: story,
        query: query
      })
    })
    .then(res => res.json())
    .then(data => data['predictions'][0]['outputs']);
  }

  class App {
    constructor() {
      this.task_name_el = document.getElementById('task-name');
      this.story_el = document.getElementById('story');
      this.query_els = document.getElementsByClassName('query');
      this.answer_el = document.getElementById('answer');
      this.next_story_el = document.getElementById('next-story');

      _.each(this.query_els, (query_el, i) => {
        query_el.addEventListener('click', this.askQuery.bind(this, i));
      })

      this.next_story_el.addEventListener('click', this.nextStory.bind(this));
    }

    toggleQueries() {
      _.each(this.query_els, query_el => {
        query_el.disabled = this.is_loading;
      });
    }

    askQuery(query_index, e) {
      e.preventDefault();

      if (this.is_loading) {
        return;
      }

      this.answer_el.innerText = 'Thinking...';
      this.is_loading = true;
      this.toggleQueries();

      let query = [tokenize(this.queries[query_index], this.task.vocab)];

      fetchAnswer(this.task_id, this.instance.story, query).then(answer_id => {
        let answer_template = ANSWER_TEMPLATES[this.task_id];
        this.answer_el.innerText = answer_template({
          location: this.task.vocab[answer_id]
        });
        this.is_loading = false;
        this.toggleQueries();
      });
    }

    nextStory(e) {
      e.preventDefault();
      if (!this.is_loading) {
        this.start();
      }
    }

    updateQueries() {
      let named_entities = getNamedEntities(this.instance.story, this.task.vocab);
      if (named_entities.length > 3) {
        named_entities = _.sample(named_entities, 3);
      }

      let query_template = QUERY_TEMPLATES[this.task_id];

      this.queries = _.map(named_entities, name => {
        return query_template({ name: name });
      });

      _.each(this.query_els, query_el => {
        query_el.style.display = 'none';
      });

      _.each(this.queries, (query, i) => {
        this.query_els[i].innerText = query;
        this.query_els[i].style.display = 'initial';
      });
    }

    start() {
      this.task_id = _.sample(Object.keys(TASKS));
      this.task_path = TASKS[this.task_id];

      fetchTask(this.task_path).then(task => {
        this.task = task;
        this.instance = _.sample(task.instances);

        let queries = this.updateQueries()

        this.task_name_el.innerText = this.task.name;
        this.story_el.innerText = stringify(this.instance.story, this.task.vocab);
        this.answer_el.innerText = 'Ask a question.';
      });
    }
  }

  const app = new App();
  app.start();
}).call(this);
