

(async function getUnit() {
    const response = await fetch(`${url}/api/unit/getunits`);
    const data = await response.json();
    var units = data.units
    const partUnit = units.map(function (unit) {
        console.log(unit)
        return `<div class="card-unit" id='unit_${unit.id}'>
                    <div class="header">
                        <div class="mask">
                            <div class="border">
                                <a href='/exam.html?unit=${unit.slug}&process=english-vietnamese' class='mask-pill anh-viet'>
                                    <span>Anh - việt</span>
                                    <small class="percent">Completed</small>
                                </a>
                            </div>
                            <div class="border">
                                <a href='/exam.html?unit=${unit.slug}&process=vietnamese-english ' class='mask-pill viet-anh'>
                                    <span>Việt - Anh</span>
                                      <small class="percent">0</small>
                                </a>
                            </div>
                        </div>
                        <div class="card-unit-image">
                            <img src="${url}/unit/images/${unit.backgroudImage}" alt="">
                        </div>
                    </div>
                    <div class="content">
                        <h3 class="title">
                        ${unit.name}    
                        </h3>
                        <p class="description">
                        ${unit.description}
                        </p>
                    </div>
                    <div class="footer">
                        <div class="info">
                            <div class='quantity-user'>
                                <i class="fad fa-users icon"></i>
                                <i class='quantity'>${unit.subscriber}</i>
                            </div>
                            <div class="quantity-vocabulary">
                                <i class="">Vocabulary: </i>
                                <i class='quantity'>${unit.quantityVocabulary}</i>
                            </div>
                        </div>
                        <div class="percent-complete">
                            <i class="present">0%</i>
                        </div>
                    </div>
                </div>`
    })
    document.querySelector('.card-units').innerHTML = partUnit.join(' ')
}())

function init() {
    getExam()
}
async function getExam() {
    try {
        // Get the access token from the Auth0 client
        const response = await fetch(`${url}/api/exam/getexam`);
        let units = {}
        const result = await response.json();
        // console.log(result)
        // console.log(JSON.stringify(result, {}, 2))
        result.exam.forEach(function (exam) {
            if (exam.process_id == 1) {
                // process English - Viotnamese
                $('head').append(`<style>  #unit_${exam.unit_id}:hover .mask .anh-viet:before{width:${exam.percentComplete}% !important;}</style>`);
                showPercent(exam.unit_id, '.anh-viet', exam.percentComplete)
            } else {
                // process Viotnamese - English
                $('head').append(`<style>  #unit_${exam.unit_id}:hover .mask .viet-anh:before{width:${exam.percentComplete}% !important;}</style>`);
                showPercent(exam.unit_id, '.viet-anh', exam.percentComplete)
            }

            function showPercent(unit_id, process, percentComplete) {
                // console.log(unit_id, process, percentComplete)

                if (percentComplete >= 100) {
                    $(` #unit_${unit_id} ${process} .percent`).text('Completed')
                } else {
                    $(` #unit_${unit_id} ${process} .percent`).text(`${percentComplete}%`)
                }
            }
            if (units[exam.unit_id]) {
                units[exam.unit_id] += exam.percentComplete

            } else {
                units[exam.unit_id] = exam.percentComplete
            }
        })
        for (unit in units) {
            // console.log(unit + ' = ' + units[unit])
            $('head').append(`<style>  #unit_${unit} .footer .percent-complete:before{width:${units[unit] / 2}% !important;}</style>`);
            $(`#unit_${unit} .footer .present`).text(`${units[unit] / 2}%`)
        }

    } catch (e) {
        // Display errors in the console
        // console.error(e);
    }
}