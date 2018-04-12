const clients = [];

function broadcast(message) {
  for (let client of clients) {
    client.postMessage(message);
  }
}

var isLoggedIn = false;

self.addEventListener(
  "connect",
  function(event) {
    var port = event.ports[0];
    clients.push(port);

    port.addEventListener("message", function(event) {
      const { id, type } = event.data;

      switch (type) {
        case "changelogin":
          isLoggedIn = !isLoggedIn;

          if (isLoggedIn) {
            broadcast({ type: "login", id });
          } else {
            broadcast({ type: "logout", id });
          }
          break;

        case "addcity":
          broadcast(event.data);
          break;
      }
    });

    port.start();

    broadcast({ type: "connect", id: clients.length, isLoggedIn });
  },
  false
);