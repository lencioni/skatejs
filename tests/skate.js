(function() {

  function addDivToBody(id) {
    var div = document.createElement('div');
    div.id = id || 'test';
    document.querySelector('body').appendChild(div);
    return div;
  }

  function removeDivFromBody(id) {
    var div = document.querySelector('#' +  (id || 'test'));

    if (div) {
      document.querySelector('body').removeChild(div);
    }
  }


  afterEach(function() {
    skate.destroy();
    document.querySelector('body').innerHTML = '';
  });


  describe('Events', function() {
    it('Should trigger ready before the element is shown.', function(done) {
      skate('div', {
        ready: function() {
          assert(!this.className.match('skate'));
          done();
        }
      });

      addDivToBody();
    });

    it('Should trigger insert after the element is shown.', function(done) {
      skate('div', {
        insert: function() {
          assert(this.className.match('skate'));
          done();
        }
      });

      addDivToBody();
    });

    it('Should trigger removed when the element is removed.', function(done) {
      skate('div', {
        remove: function() {
          assert(true);
          done();
        }
      });

      skate(addDivToBody('removed'));
      removeDivFromBody('removed');
    });
  });


  describe('DOM node interaction.', function() {
    it('Modules should pick up nodes already in the DOM.', function(done) {
      addDivToBody().textContent = 'test';

      skate('div', function() {
        this.textContent.should.equal('test', 'Existing node not initialised');
        done();
      });
    });

    it('Modules should pick up nodes inserted into the DOM after they are defined.', function(done) {
      skate('div', function() {
        this.textContent.should.equal('test', 'Future node not initialised');
        done();
      });

      addDivToBody().textContent = 'test';
    });

    it('When destroyed, that module should no longer affect new nodes.', function(done) {
      var oldModule = skate('div', function() {
        assert(false);
        oldModule.deafen();
        done();
      }).deafen();

      addDivToBody().textContent = 'test';

      var newModule = skate('div', function() {
        this.textContent.should.equal('test');
        done();
      }).deafen();
    });
  });


  describe('Async ready event.', function() {
    it('Ready event should be async and provide a done callback.', function(done) {
      var ok = false;

      skate('div', {
        ready: function(next) {
          setTimeout(function() {
            ok = true;
            next();
          }, 100);
        },

        insert: function() {
          assert(ok);
          done();
        }
      });

      addDivToBody();
    });

    it('Ready done callback should accept a DOM element which replaces the existing element.', function(done) {
      skate('div', {
        ready: function(next) {
          setTimeout(function() {
            next(document.createElement('span'));
          }, 100);
        },

        insert: function() {
          assert(this.nodeName === 'SPAN');
          done();
        }
      });

      addDivToBody();
    });
  });

  describe('Display none / block / etc behavior', function() {
    it('Should not be initialised twice', function() {
      var initialised = 0;

      skate('div', function() {
        ++initialised;
      });

      var div = addDivToBody();
      skate(div);
      div.style.display = 'none';
      div.style.display = 'block';
      assert(initialised === 1);
    });
  });

  describe('Synchronous initialisation', function() {
    it('Should take traversable items', function() {
      var initialised = false;

      skate('div', function() {
        ++initialised;
      });

      addDivToBody();
      addDivToBody();

      skate(document.querySelectorAll('div'));
      assert(initialised === 2);
    });

    it('Should take an element', function() {
      var initialised = 0;

      skate('div', function() {
        ++initialised;
      });

      skate(addDivToBody());
      assert(initialised === 1);
    });

    it('Should take a selector', function() {
      var initialised = 0;

      skate('div', function() {
        ++initialised;
      });

      addDivToBody();
      addDivToBody();

      skate('div');
      assert(initialised === 2);
    });
  });

  describe('Destroying all instances', function() {
    it('Should be able to destroy all instances', function() {
      assert(skate.instances.length === 0);

      skate('div', function(){});
      assert(skate.instances.length === 1);

      skate.destroy();
      assert(skate.instances.length === 0);

      var div = addDivToBody();
      skate(div);
      div.textContent.should.equal('');
    });
  });

})();
