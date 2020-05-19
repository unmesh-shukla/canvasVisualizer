
/**Add bezier to context*/
CanvasRenderingContext2D.prototype.bezier = bezier;

var ctx;

/**Draws a N grade bezier curve from current point on the context*/
function bezier() {

    ctx = this;
    ctx.lineWidth = this.curve_thickness;
    ctx.strokeStyle = this.bezier_color;
    /**check for correct number of arguments*/
    if (arguments.length % 2 != 0 || arguments.length < 4) {
        throw "Incorrect number of points " + arguments.length;
    }

    //transform initial arguments into an {Array} of [x,y] coordinates
    var initialPoints = [];
    for (var i = 0; i < arguments.length; i = i + 2) {
        initialPoints.push([arguments[i], arguments[i + 1]]);
    }

    function distance(a, b) {
        return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
    }

    /**Computes the drawing/support points for the Bezier curve*/
    function computeSupportPoints(points) {

        /**Computes factorial*/
        function fact(k) {
            if (k == 0 || k == 1) {
                return 1;
            } else {
                return k * fact(k - 1);
            }
        }

        /**Computes Bernstain
         *@param {Integer} i - the i-th index
         *@param {Integer} n - the total number of points
         *@param {Number} t - the value of parameter t , between 0 and 1
         **/
        function B(i, n, t) {
            //if(n < i) throw "Wrong";
            return fact(n) / (fact(i) * fact(n - i)) * Math.pow(t, i) * Math.pow(1 - t, n - i);
        }


        /**Computes a point's coordinates for a value of t
         *@param {Number} t - a value between o and 1
         *@param {Array} points - an {Array} of [x,y] coodinates. The initial points
         **/
        function P(t, points) {
            var r = [0, 0];
            var n = points.length - 1;
            for (var i = 0; i <= n; i++) {
                r[0] += points[i][0] * B(i, n, t);
                r[1] += points[i][1] * B(i, n, t);
            }
            return r;
        }


        /**Compute the incremental step*/
        var tLength = 0;
        for (var i = 0; i < points.length - 1; i++) {
            tLength += distance(points[i], points[i + 1]);
        }
        var step = 1 / tLength;

        //compute the support points
        var temp = [];
        for (var t = 0; t <= 1; t = t + step) {
            var p = P(t, points);
            temp.push(p);
        }
        return temp;
    }

    /**Generic paint curve method*/
    function paintCurve(points) {
        ctx.save();

        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1]);
        }
        ctx.stroke();
        ctx.restore();
    }

    var supportPoints = computeSupportPoints(initialPoints);
    paintCurve(supportPoints);
}