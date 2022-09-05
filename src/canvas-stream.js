export const canvasStreamer = {
    timerCallback: function () {
        if (this.video.paused || this.video.ended) {
            return;
        }
        this.computeFrame();
        let self = this;
        setTimeout(function () {
            self.timerCallback();
        }, 0);
    },

    doLoad: function () {
        console.log("Enter Here")
        this.video = document.querySelector('.preview>video');

        this.c1 = document.getElementById("c1");
        this.ctx1 = this.c1.getContext("2d");
        let self = this;
        /*   this.video.addEventListener("play", function () { */
        self.width = self.video.videoWidth / 2;
        self.height = self.video.videoHeight / 2;

        this.c1.width = self.width
        this.c1.height = self.height
        self.timerCallback();
        /*  }, false); */
    },

    computeFrame: function () {

        this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
        let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
        let l = frame.data.length / 4;

        for (let i = 0; i < l; i++) {
            /*   let r = frame.data[i * 4 + 0];
              let g = frame.data[i * 4 + 1];
              let b = frame.data[i * 4 + 2]; */

            frame.data[i * 4 + 1] += 100
            frame.data[i * 4 + 2] += 20
            frame.data[i * 4 + 3] += 50;
        }
        this.ctx1.putImageData(frame, 0, 0);
        return;
    }
};