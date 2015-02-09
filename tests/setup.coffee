setup = ->
  spyOn(defer, 'listen').and.callThrough()
  defer.showConsole = false;
  imgs = []

  [1..50].forEach ->
    img = document.createElement 'img';
    img.setAttribute 'data-src', "htttp://localhost/empty-image"
    imgs.push img

  imgs.forEach (img) ->
    document.body.appendChild img
    defer.add img

  imgs

teardown = (imgs) ->
  defer.destroy()
  imgs.forEach (el) ->
    document.body.removeChild el