'use strict';
angular
    .module('line')
    .factory('visualization', function () {
        var context = new AudioContext(),
            barWidth = 5,
            barGap = 2,
            canvas ,
            ctx ,
            HEIGHT, WIDTH, total, source, analyser = context.createAnalyser();
        var visualization = {
            type: 'FREQUENCY',//TIMEDOMAIN
            link: function (el) {
                canvas = el;
                ctx = canvas.getContext('2d');
                ctx.fillStyle = ctx.strokeStyle = '#F39800';
            },
            attachTo: function (howl) {
                var ids = howl._getSoundIds(),
                    id = ids[0],
                    sound = howl._soundById(id),
                    audio = sound._node;
                if (!howl.source) {
                    source = context.createMediaElementSource(audio);
                    howl.source = source;
                } else {
                    source = howl.source;
                }
                analyser = context.createAnalyser();
                source.connect(analyser);
                analyser.connect(context.destination);
            }
        };

        function loop() {
            requestAnimationFrame(loop);
            if (!canvas) {
                return;
            }
            HEIGHT = canvas.height;
            WIDTH = canvas.width;
            total = Math.floor(WIDTH / (barWidth + barGap));
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            var size = analyser.frequencyBinCount, i;
            if (visualization.type === 'FREQUENCY') {
                var frequency = new Uint8Array(size);
                analyser.getByteFrequencyData(frequency);
                for (i = 0; i < total; i++) {
                    var value = frequency[i * Math.floor(size / total)];
                    var percent = value / 256;
                    var height = HEIGHT * percent;
                    var offset = HEIGHT - height;
                    ctx.fillRect(i * (barWidth + barGap), offset, barWidth, height);
                }
            } else if (visualization.type === 'TIMEDOMAIN') {
                var timeDomain = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteTimeDomainData(timeDomain);
                var rate = size / WIDTH;
                ctx.beginPath();
                for (i = 0; i < WIDTH; i++) {
                    if (i === 0) {
                        ctx.moveTo(i, HEIGHT - timeDomain[Math.floor(i * rate)] * (HEIGHT / 255));
                    } else {
                        ctx.lineTo(i, HEIGHT - timeDomain[Math.floor(i * rate)] * (HEIGHT / 255));
                    }
                    if (typeof window.heightest === 'undefined') {
                        window.heightest = timeDomain[Math.floor(i * rate)];
                    } else {
                        window.heightest = Math.min(window.heightest, timeDomain[Math.floor(i * rate)]);
                    }
                }
                ctx.stroke();
            }
        }

        loop();
        return visualization;
    });