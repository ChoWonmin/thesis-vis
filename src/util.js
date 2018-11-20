const Util = function () {

  this.bfs = function (nodes, root, action) {
    const visit = {};

    const queue = [];
    queue.push(root);
    visit[root.id] = true;

    while(queue.length > 0) {
      const node = queue.shift();

      action(node);

      node.color = '#ffaaff';
    }
  }

};
