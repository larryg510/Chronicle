  angular.module('chronicle.api.event', ['chronicle.api.http'])
  .factory('apiEvent', ['apiHTTP',
    function(apiHTTP){
      
      function Event(id, prefix){
        this.http = new apiHTTP((prefix || '/api') + '/event/' + id);
      }
      
      Event.prototype = {
        info: function(){
          return this.http.get();
        },
        newContent: function(content, id){
          if(content){
            console.log(id);
            return this.http.post('/content' + (id ? '?id=' + id : ''), content);
          }
          else{
            return this.http.get('');
          }
        },
        update: function(metadata){
          return this.http.post('', metadata);
        },
        deleteEvent: function(){
          return this.http.delete('');
        },
        deleteContent: function(id){
          return this.http.delete('/content', id);
        },
        trackupdates: function(content){
          return this.http.post('/trackupdates', content);
        }
      };
      
      return function(id, prefix){
        return new Event(id, prefix);
      };
    }
  ]);

/*
    if(metadata){
            console.log(before);
            return this.http.post('/events' + (before ? '?before=' + before : ''), metadata);
          }else {
            return this.http.get('/events');
          }
*/