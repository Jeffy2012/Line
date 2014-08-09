'use strict';
angular
    .module('line')
    .controller('playerCtrl',
    function ($scope, player) {
        $scope.player = player;
        $scope.seek = function (event) {
            var current = player.current || {},
                duration = current.duration || 0,
                width = $(event.currentTarget).width(),
                offsetX = event.offsetX;
            player.seek(Math.floor(offsetX / width * duration));
        };
        $scope.$on('player:END', function () {
            var mode = player.mode,
                type = player.type,
                current = player.current || {};
            if (mode === 'LOOP' && type === 'PLAYLIST') {
                player.play(current);
            } else {
                player.next();
            }
        });
        $scope.show = 'FREQUENCY';
        var context = new AudioContext(),
            canvas = $(".player canvas")[0],
            $visual = $(".player .visual"),
            ctx = canvas.getContext("2d"),
            barWidth = 8,
            barGap = 2,
            HEIGHT, WIDTH, total, source, analyser;


        function loop() {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            var size = analyser.frequencyBinCount, i;
            if ($scope.show == "FREQUENCY") {
                var frequency = new Uint8Array(size);
                analyser.getByteFrequencyData(frequency);
                for (i = 0; i < total; i++) {
                    var value = frequency[i * Math.floor(size / total)];
                    var percent = value / 256;
                    var height = HEIGHT * percent;
                    var offset = HEIGHT - height;
                    ctx.fillRect(i * (barWidth + barGap), offset, barWidth, height);
                }
            } else if ($scope.show == "TIMEDOMAIN") {
                var timeDomain = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteTimeDomainData(timeDomain);
                var rate = size / WIDTH;
                ctx.beginPath();
                for (i = 0; i < WIDTH; i++) {
                    if (i == 0) {
                        ctx.moveTo(i, HEIGHT - timeDomain[Math.floor(i * rate)] * (HEIGHT / 255));
                    } else {
                        ctx.lineTo(i, HEIGHT - timeDomain[Math.floor(i * rate)] * (HEIGHT / 255));
                    }
                    if (typeof window.heightest == 'undefined') {
                        window.heightest = timeDomain[Math.floor(i * rate)]
                    } else {
                        window.heightest = Math.min(window.heightest, timeDomain[Math.floor(i * rate)])
                    }
                }
                ctx.stroke();
            }
            requestAnimationFrame(loop);
        }


        $scope.$on('player:PLAY', function (event, howl) {
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
            loop();
        });
        function dealCanvas() {
            HEIGHT = $visual.height();
            WIDTH = $visual.width();
            total = Math.floor(WIDTH / (barWidth + barGap));
            canvas.height = HEIGHT;
            canvas.width = WIDTH;
            ctx.fillStyle = "#F39800";
            ctx.strokeStyle = "#F39800";
        }

        $(window).resize(dealCanvas);
        dealCanvas();
    });