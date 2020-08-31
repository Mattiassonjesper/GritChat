// Self invoked anonymous function
(function () {
  let peer = null;
  let conn = null;

  const peerOnOpen = (id) => {
    document.querySelector(".my-peer-id").innerHTML = id;
  };

  const peerOnError = (error) => {
    console.log(error);
  };
  const connectToPeerClick = (el) => {
    const peerId = el.target.textContent;
    conn && conn.close();
    conn = peer.connect(peerId);
    conn.on("open", () => {
      console.log("Connection open");
      const event = new CustomEvent("peer-changed", {
        detail: { peerId: peerId },
      });
      document.dispatchEvent(event);
    });
    conn.on("error", consoleLog);
  };

  //Connect to peer server
  const myPeerId = location.hash.slice(1);
  console.log(myPeerId);
  peer = new Peer(myPeerId, {
    host: "glajan.com",
    port: 8443,
    path: "/myapp",
    secure: true,
  });

  // Handle peer events
  peer.on("open", peerOnOpen);
  peer.on("error", peerOnError);

  //List all peers connected and filter out myPeerId
  //Create button for every peer connected
  document
    .querySelector(".list-all-peers-button")
    .addEventListener("click", () => {
      const peersEl = document.querySelector(".peers");
      peersEl.firstChild && peersEl.firstChild.remove();
      const ul = document.createElement("ul");
      peer.listAllPeers((peers) => {
        peers
          .filter((p) => p !== myPeerId)
          .forEach((peerId) => {
            const li = document.createElement("li");
            const button = document.createElement("button");
            button.innerText = peerId;
            button.classList.add("connect-button");
            button.classList.add(`peerId-${peerId}`);
            button.addEventListener("click", connectToPeerClick);
            li.appendChild(button);
            ul.appendChild(li);
          });
        peersEl.appendChild(ul);
      });
    });
  // Peer changed
  document.addEventListener("peer-changed", (e) => {
    const peerId = e.detail.peerId;
    console.log("peerid: ", peerId);

    document.querySelectorAll(".connect-button.connected").forEach((el) => {
      el.classList.remove("connected");
    });

    const button = document.querySelector(`.connect-button.peerId-${peerId}`);
    button.classList.add("connected");
  });
})();
