var inputUnitName = document.getElementById("unit-name")
var inputUnitDescription = document.getElementById("unit-description")
var messageUnitName = document.getElementById("message-unit-name")
var messageUnitDescription = document.getElementById("message-unit-description")
var iconUnitName = document.getElementById('icon-status-name-unit')
var iconUnitDescription = document.getElementById('icon-status-name-description')
var btnFinish = document.getElementById('btn-finish')
var messageTable = document.getElementById('message-table')
const imagefile = document.getElementById('image');
var htmlTypes = ``;
var table = $('.create-unit table')
var numberRowDefault = 5
var index = 0
var rowID = 0
var maxLength = 20
var maxLengthUnit = 40
var minLengthUnit = 5
var maxLengthDescription = 200
var minQuantityVocabulary = 5
var controlVocabularies = controlQuestions()
function init() {

}

(async function getTypeVocabulary() {
    var { data } = await axios.get(`${url}/api/typevocabulary`)
    let Abbreviation
    htmlTypes = await data.typeVocabulary.map((type) => {
        Abbreviation = type.Abbreviation ? `(${type.Abbreviation})` : ''
        return `   <option value="${type.id}"> ${type.NameEnglish} ${Abbreviation}</option>`;
    })
    loadRowDefault()
}());
function loadRowDefault() {
    for (let i = 0; i < numberRowDefault; i++) {
        addRow()
    }
}
function addRow() {
    var htmlRow = ` <tr onclick="rowActive(${rowID})" id = 'rowID_${rowID}' >
                        <td>
                            <div class="form-input index">
                              <i> ${++index} </i>
                            </div>
                        </td>
                        <td>
                            <div class="form-input"> 
                                <input type="text" class="input ">
                            </div>
                        </td>
                        <td >
                            <div class="form-input">
                                <input type="text" class="input">
                            </div>

                        </td>
                        <td>
                            <div class="form-input">
                                <input type="text" class="input" >
                            </div>
                        </td>
                        <td>
                            <div class="form-input">
                                <select class="input" name="" id="">
                                ${htmlTypes}
                            </select>
                            </div>
                        </td>
                        <td >
                            <div class="remove-row"  onclick="removeRow(${rowID++})" >
                                <i class="fad fa-trash"></i>
                                <!-- <i class="fad fa-trash-alt"></i> -->
                            </div>
                        </td>
                    </tr>`
    table.append(htmlRow)
}
// show icon delete
$('table').on('click', 'td', (e) => {
    // console.log(e);
})
$('.btn-add-row').on('click', (e) => {
    addRow()
})


function rowActive(id) {
    $(`table .remove-row`).hide()

    $(`table  #rowID_${id} .remove-row `).show()
}

function removeRow(id) {
    $(`table  #rowID_${id} `).remove();
    if (id != rowID - 1) {
        restartIndex()
    }
}

function restartIndex() {
    index = 0
    for (var i = 0; i < rowID; i++) {
        if ($(`#rowID_${i} .index i`).html()) {
            $(`#rowID_${i} .index i `).html(++index)
        }
    }
}
function checkTextUnit(inputElement, messageElement, iconElement, nameField, maxL) {
    let name = inputElement.value
    if (!name || (name = name.trim()) == '' || name.length > maxL || name.length < minLengthUnit) {
        messageElement.innerText = nameField + " can't empty and length 5-" + maxL + " characters"
        iconElement.className = "icont-fail fal fa-times-octagon"
        messageElement.style.display = 'block'
        inputElement.focus()
        return false;
    }
    iconElement.className = "icont-success fas fa-check-circle"
    messageElement.innerText = ""
    messageElement.style.display = 'none'
    return true

}
async function checkNameUnit() {
    let name = inputUnitName.value
    if (!checkTextUnit(inputUnitName, messageUnitName, iconUnitName, 'Unit Name', maxLengthUnit)) {
        return false;
    }
    console.log(`${url}/api/unit/checknameunit?name=` + name)
    var result = await axios({
        method: 'get',
        url: `${url}/api/unit/checknameunit?name=` + name
    })

    if (!result || result.data.exist) {
        iconUnitName.className = "icont-fail  fal fa-times-octagon"
        messageUnitName.innerHTML = `Name Unit used be. Please change to another name  <i class="far fa - sad - tear"></i> <i class="far fa - sad - tear"></i> <i class="far fa - sad - tear"></i>`
        inputUnitName.focus()
        messageUnitName.style.display = 'block'
        return false;
    }
    return true
}
function checkDescriptionUnit() {
    if (!checkTextUnit(inputUnitDescription, messageUnitDescription, iconUnitDescription, 'Unit Description', maxLengthDescription)) {
        return false;
    }
    return true
}

inputUnitName.addEventListener("blur", async () => {
    if (await checkNameUnit()) {
        controlVocabularies.setName(inputUnitName.value.trim())
    }
    // alert('ahihi')
})
inputUnitDescription.addEventListener("blur", async () => {
    if (await checkDescriptionUnit()) {
        controlVocabularies.setDescriptoin(inputUnitDescription.value)
    }
    // alert('ahihi')
})


// submit 
btnFinish.addEventListener("click", async () => {
    controlVocabularies.empty()
    var resultChekNameUnit = await checkNameUnit();
    var resultChekDesUnit = await checkDescriptionUnit();
    console.log({ resultChekNameUnit, resultChekDesUnit })
    if (!resultChekNameUnit || !resultChekDesUnit) {
        return
    }
    let english, vietnamese, spelling, typeVocabulary_id
    let tr = document.getElementById("vocabularies").querySelectorAll("tr")
    for (let index = 1; index < tr.length; index++) {
        english = tr[index].cells[1].querySelector("input").value
        vietnamese = tr[index].cells[2].querySelector("input").value
        spelling = tr[index].cells[3].querySelector("input").value
        typeVocabulary_id = tr[index].cells[4].querySelector("select").value

        if (!english || english.trim() == "" || english.trim().length > maxLength) {
            statusForm(tr[index].cells[1], false)
            errorTable("The length of filed english must be less than 20 and gender than 1")
            controlVocabularies.empty()
            return
        }
        statusForm(tr[index].cells[1], true)
        if (!vietnamese || vietnamese.trim() == "" || vietnamese.trim().length > maxLength) {
            statusForm(tr[index].cells[2], false)
            errorTable("The length of filed vietnamese must be less than 20 and gender than 1")
            controlVocabularies.empty()
            return
        }
        statusForm(tr[index].cells[2], true)
        if (!spelling) {
            spelling = ""
        } else {
            if (spelling.trim().length > maxLength) {
                statusForm(tr[index].cells[3], false)
                errorTable("The length of spelling must be gender than 1 and less than 20  ")
                controlVocabularies.empty()

                return
            }
        }
        statusForm(tr[index].cells[3], true)
        controlVocabularies.add(english, vietnamese, spelling, typeVocabulary_id)
    }
    if (controlVocabularies.getSize() < minQuantityVocabulary) {
        errorTable("Quantity vocabulary need gander 5 ")
        controlVocabularies.empty()
        return
    }

    console.table(controlVocabularies.getQuestion())

    controlVocabularies.storeQuestion()

})
//        errorTable("Quantity vocabularies must be Greater than 5")
function errorTable(mgs) {
    // console.log(mgs)
    messageTable.innerHTML = mgs
}

function statusForm(e, status) {
    if (!status) {
        e.querySelector("div").className = 'form-input form-fail'
        e.querySelector("input").focus();
    } else {
        e.querySelector("div").className = 'form-input'
    }
}
if (auth0 == null) {
    alert('require login')
}

function controlQuestions() {
    var question = []
    var unitName
    var UnitDescriptoin



    function setName(name) {
        unitName = name
    }
    function setDescriptoin(description) {
        UnitDescriptoin = description
    }
    function getSize() {
        return question.length
    }
    function add(english, vietnamese, spelling, typeVocabulary_id) {
        question.push({
            english,
            vietnamese,
            spelling,
            typeVocabulary_id
        })
    }

    function empty() {
        question = []
    }

    function getQuestion() {
        return question
    }

    async function storeQuestion() {
        // {
        //     vocabularies: question,
        //     unitName: unitName,
        //     UnitDescriptoin: UnitDescriptoin
        // }
        const formData = new FormData();
        formData.append("image", imagefile.files[0]);
        formData.append("vocabularies", question)
        formData.append("unitName", unitName)
        formData.append("UnitDescriptoin", UnitDescriptoin)
        const token = await auth0.getTokenSilently();
        var result = await axios(formData, {
            method: 'post',
            url: `${url}/api/unit/create`,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },

        })
        console.log(result)
    }
    return { add, empty, getQuestion, setName, storeQuestion, getSize, setDescriptoin }
}