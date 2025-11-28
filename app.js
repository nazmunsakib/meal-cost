;( ()=>{

  const getClculate     =  document.getElementById('calculate-cost');
  const downloadrResult =  document.getElementById('download-reasult');
  const memberCount     = document.getElementById('memberCount');

    function generateMembers(members) {
        const container = document.getElementById('membersContainer');
        container.innerHTML = '';
        const count = parseInt(members) || 0;
  
        for (let i = 0; i < count; i++) {
          const div = document.createElement('div');
          div.className = 'member';
  
          const nameInput = document.createElement('input');
          nameInput.type = 'text';
          nameInput.placeholder = `Member ${i + 1} Name`;
          nameInput.className = 'memberName';
  
          const mealInput = document.createElement('input');
          mealInput.type = 'number';
          mealInput.placeholder = 'Meals';
          mealInput.className = 'mealNumber';
  
          const costSpan = document.createElement('span');
          costSpan.className = 'cost';
          costSpan.textContent = '৳ 0.00';

          const details = document.createElement('p');
          details.className = 'cost-details';

          const costNote = document.createElement('span');
          costNote.className = 'cost-note';
          costNote.textContent = 'Others Cost + Meal Cost =';

          const costReduce = document.createElement('span');
          costReduce.className = 'cost-reduce';
          costReduce.textContent = 'Reduce ৳ 0.00';

          details.appendChild(costNote);
          details.appendChild(costReduce);
          div.appendChild(nameInput);
          div.appendChild(mealInput);
          div.appendChild(details);
          div.appendChild(costSpan);
  
          container.appendChild(div);
        }
      }

      if(memberCount ){
        memberCount.addEventListener('keyup', function(E){
            const getMemberCount = this.value;
            generateMembers(getMemberCount);
          });
      }

      function getTotalMeal(selector){
        if( !selector ){
            return 0;
        }
        let totalMeal   = 0

        selector.forEach(member => {
            const mealInput = member.querySelector('.mealNumber');
            const meals = parseFloat(mealInput.value) || 0;

            totalMeal += meals;

        });

        document.getElementById('totalMeal').innerHTML = totalMeal;

        return totalMeal;
      }

      function getMemberCosts(selector, perMealCost, otherCost = 0, totalMember = 5){
        if( !selector || !perMealCost ){
            return false;
        }

        let totalCost = 0;

        selector.forEach(member => {
            const mealInput     = member.querySelector('.mealNumber');
            const meals         = parseInt(mealInput.value) || 0;
            const mealCost      = perMealCost * meals;
            const memberCost    = otherCost + mealCost;
            const subsidy       = otherCost + (perMealCost * 22) - 1000;
            
            totalCost += memberCost;

            const reduce  = memberCost - subsidy;
            

            

            // const costDetails = member.querySelector('.cost-details');
            // costDetails.textContent = `${parseInt(otherCost)} + (${parseInt(mealCost)} * ${meals}) =`;

            const costSpan    = member.querySelector('.cost');
            const costReduce  = member.querySelector('.cost-reduce');

            costSpan.textContent    = `৳ ${memberCost.toFixed(2)}`;
            costReduce.textContent  = `Cut: ৳ ${reduce.toFixed(2)}`;
        });

        const memberSubsidy = otherCost + (perMealCost * 22) - 1000;
        const totalSubsidy  = memberSubsidy * totalMember;

        document.getElementById('memberSubsidy').textContent = `৳ ${memberSubsidy.toFixed(2)}`;
        document.getElementById('total-subsidy').textContent = `৳ ${totalSubsidy.toFixed(2)}`;
        document.getElementById('total-cost').textContent = `৳ ${totalCost.toFixed(2)}`;
        
        return true;
      }

      function calculateCosts(){
        const memberRow    = document.querySelectorAll('.member');

        if( memberRow.length > 0 ){
            const mealCost      = parseFloat(document.getElementById('mealCost').value) || 0;
            const otherCost     = parseInt(document.getElementById('otherCost').value) || 0;
            const memberCount   = parseInt(document.getElementById('memberCount').value) || 0;
            const totalMeal     = getTotalMeal(memberRow);

            let memberOtherCost  = 0;
            let perMealCost      = 0;
    
            if( otherCost && memberCount > 0 ){
                memberOtherCost = otherCost / memberCount;
            }
    
            if( mealCost && totalMeal > 0 ){
                perMealCost = mealCost / totalMeal;
            }

            getMemberCosts(memberRow, perMealCost, memberOtherCost, memberCount);

            return true;
        }

        return false
      }

      
      if(getClculate){
        getClculate.addEventListener('click', function(e){
            calculateCosts();

            this.textContent = 'Re Calculate';
            downloadrResult.style.display = 'block';
        });
      }

      function downloadPDF() {
        const pdfArea = document.getElementById("calculatorContainer");

        // Get current date in YYYY-MM-DD format
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
    
        let opt = {
          margin:       1,
          filename:     `meal-cost-report-${formattedDate}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
    
        html2pdf().from(pdfArea).set(opt).save();
      }

      
      if(downloadrResult){
        downloadrResult.addEventListener('click', function(e){
          downloadPDF();
        }); 
      }
})();