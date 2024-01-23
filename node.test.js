const sum = require('red/base');

x='<ul><button class="btn btn-link"'+'id="id2">item2</button><br>description2<br></br></ul>'

test('adds 1 + 2 to equal 3', () => {
  expect(displaySearchResults([{"id":2,"name":"item2","description":"description2"}])).toBe(x);
});