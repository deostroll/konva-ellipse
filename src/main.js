function RunKonvaStuff(stHeight, stWidth) {
    var stage = new Konva.Stage({
      container:'container',
      height: stHeight,
      width: stWidth
    });
    var integrator = function(f, start, end, step) {
      var total = 0;
      step = step || 0.01;
      for (var i = start; i < end; i+= step) {
        total += f(i + step/2) * step;
      }
      return total;
    };

    math.import({
      integrate: integrator
    });
    var params = {};
    params.a = 150;
    params.b = 100;
    params.factor = 4;

    params.getPerimiter = function() {
      params._f = f;
      return math.integrate(f, 0, 2* Math.PI);
      function f(t) {
        return math.sqrt(
          math.pow(params.a * math.sin(t), 2) +
          math.pow(params.b * math.cos(t), 2)
        );
      }
    };

    params.getCircleRadius = function() {
      var ep = this.getPerimiter();
      var pm = ep/this.factor;
      return pm / (2 * Math.PI);
    };

    params.getArcLength = function(t) {
      return math.integrate(params._f, 0, t);
    };

    params.getCrclePerimeter = function() {
      return Math.PI * 2 * this.getCircleRadius();
    };

    var layer = new Konva.Layer();
    var ellipse = new Konva.Ellipse({
      x: stWidth/2,
      y: stHeight/2,
      stroke: 'red',
      radius: {
        x: params.a,
        y: params.b
      },
      strokeWidth: 1
    });


    var points = [0,0 , 150, 0];

    var line = new Konva.Line({
      stroke: 'black',
      strokeWidth: 1,
      points: points,
      x:stWidth/2,
      y: stHeight/2
    });
    var spoints = [];
    var spline = new Konva.Line({
      x: 0,
      y: 0,
      points: spoints,
      stroke: 'green',
      tension: 0.3,
      strokeWidth: 2
    });
    var layer2 = new Konva.Layer();
    layer2.add(spline);

    var r = params.getCircleRadius();
    var circle = new Konva.Circle({
      x: ellipse.x() + params.a + r,
      y: ellipse.y(),
      radius: r,
      stroke: 'blue',
      strokeWidth: 1
    });
    var cline = new Konva.Line({
      x: circle.x(),
      y: circle.y(),
      points: [0,0, -circle.radius(), 0],
      stroke: 'green',
      visible: true
    });
    var point = new Konva.Circle({
      x: ellipse.x() + params.a,
      y: ellipse.y(),
      radius: 2,
      fill:'green'
    });
    var group = new Konva.Group({
      y: circle.y(),
      x: circle.x(),
    });
    // group.add(line, circle);
    group.add(cline, point, circle);
    group.offset({x: circle.radius(), y: circle.radius()});
    // group.setPosition(circle.getPosition());
    group.offset(circle.getPosition());

    layer.add(ellipse, line, group);
    stage.add(layer);
    stage.add(layer2);
    var angSpeed = 360 / 4;
    var theta = 0;
    var cp = params.getCrclePerimeter();
    var getRotationDeg = function(arcLength) {
      if(arcLength < cp) {
        return arcLength * 180 / (Math.PI * circle.radius());
      }
      else {
        // arcLength > cp
        var revolutions = Math.floor(arcLength/cp);
        var remaining = arcLength - revolutions * cp;
        return remaining * 180 / (Math.PI * circle.radius());
      }
    };
    var animate = function(frame) {
      if(theta > 360) {
        theta = 0;
        //layer2.clear();
        spoints.length = 0;
      }
      theta += frame.timeDiff * angSpeed/1000;
      var thRad = theta * Math.PI/180;
      var rx, ry, rcx, rcy;
      rx = params.a * Math.cos(thRad);
      ry = params.b * Math.sin(thRad);
      rcx = rx + circle.radius() * Math.cos(thRad);
      rcy = ry + circle.radius() * Math.sin(thRad);
      points[points.length - 2] = rx;
      points[points.length - 1] = ry;

      var
        pos = line.getPosition(),
        cx = pos.x + rcx,
        cy = pos.y + rcy;
      // group.setPosition({x: cx, y: cy});
      group.setPosition({x: cx, y: cy});
      var al = params.getArcLength(thRad);
      var deg = getRotationDeg(al);
      group.setRotation(deg);
      var p = point.getAbsolutePosition();
      console.log(spoints.length);
      //spoints.push.apply(spoints, [p.x, p.y]);
      spoints.push(p.x, p.y);
    };

    var anim = new Konva.Animation(animate, [layer, layer2]);
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
