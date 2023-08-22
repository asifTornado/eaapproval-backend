var rateMixin = {
    methods:{
        getRate(number){

        var star1 = document.getElementById('s1');
        var star2 = document.getElementById('s2');
        var star3 = document.getElementById('s3');
        var star4 = document.getElementById('s4');
        var star5 = document.getElementById('s5');

        var list = [star1, star2, star3, star4, star5]

        
                
                  for(let x = 0; x < number; x++){
                    list[0].classList.add('text-yellow-400')
                    list[0].classList.remove('text-gray-300')
                  }
                
                    
            },

        
        getRateHover(number){
            for(let x = 0; x < number; x++){
                list[0].classList.add('text-yellow-400')
                list[0].classList.remove('text-gray-300')
            }
        }
        }
    }
