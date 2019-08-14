(function(){
  var waves = new SineWaves({
    el: document.getElementById('waves'),
    speed: 5,
    rotate: 0,
    ease: 'SineInOut',
    wavesWidth: '75%',
    waves: [
    {
      timeModifier: 4,
      lineWidth: 1,
      amplitude: -20,
      wavelength: 20
    },
    {
      timeModifier: 2,
      lineWidth: 1,
      amplitude: -10,
      wavelength: 27,
    },
    {
      timeModifier: 1,
      lineWidth: 1,
      amplitude: -27,
      wavelength: 27,
    },
		{
      timeModifier: 3,
      lineWidth: 1,
      amplitude: 36,
      wavelength: 36
    },
    {
      timeModifier: 0.5,
      lineWidth: 1,
      amplitude: -50,
      wavelength: 50
    },
    {
      timeModifier: 1.3,
      lineWidth: 1,
      amplitude: -36,
      wavelength: 36
    }
  ],
  initialize: function (){},
  resizeEvent: function() {
    var gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
    gradient.addColorStop(0,"rgba(0, 0, 255, 0)");
    gradient.addColorStop(0.5,"rgba(255, 0, 0, 0.75)");
    gradient.addColorStop(1,"rgba(0, 255, 0, 0");
    var index = -1;
    var length = this.waves.length;
	  while(++index < length){
      this.waves[index].strokeStyle = gradient;
    }
  }
  });
})();
