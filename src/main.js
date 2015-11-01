function RunKonvaStuff(stHeight, stWidth) {
    var stage = new Konva.Stage({
      container:'container',
      height: stHeight,
      width: stWidth
    });

    var layer = new Konva.Layer();
    var ellipse = new Konva.Ellipse({
      x: stWidth/2,
      y: stHeight/2,
      stroke: 'red',
      radius: {
        x: 150,
        y: 100
      },
      strokeWidth: 1
    });

    var group = new Konva.Group({
      // x: stWidth/2,
      // y: stHeight/2,
    });
    var points = [0,0 , 150, 0];

    var line = new Konva.Line({
      stroke: 'black',
      strokeWidth: 1,
      points: points,
      x:stWidth/2,
      y: stHeight/2
    });

    var circle = new Konva.Circle({
      x: stWidth/2 + 150,
      y: stHeight/2,
      radius: 50,
      stroke: 'blue',
      strokeWidth: 1
    });

    group.add(line, circle);

    layer.add(ellipse,group);
    stage.add(layer);
    var angSpeed = 360 / 4;
    var theta = 0;
    var animate = function(frame) {
      theta += frame.timeDiff * angSpeed/1000;
      var thRad = theta * Math.PI/180;
      var rx, ry;
      if(theta < 360) {
        var arr = points;
        rx = 150 * Math.cos(thRad);
        ry = 100 * Math.sin(thRad);
        arr[arr.length - 2] = rx;
        arr[arr.length - 1] = ry;
      }
      else {
        theta = 0;
        rx = 150; ry = 0;
        points[points.length - 2] = rx;
        points[points.length - 1] = ry;
      }
      var cx = rx + stWidth/2, cy = ry + stHeight/2;
      circle.setPosition({x:cx, y: cy});
    };
    console.log(line);
    var anim = new Konva.Animation(animate, layer);
    setTimeout(function(){
      anim.start();
    }, 2000);
}

window.addEventListener('load', function(){
  var container = document.getElementById('container');
  var left = container.parentNode.offsetLeft;
  var top = container.offsetTop;
  var maxHt = window.innerHeight - top - left;
  var maxWd = window.innerWidth - left * 2;
  RunKonvaStuff(maxHt, maxWd);
}, false);
