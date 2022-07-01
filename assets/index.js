/**
 * Initialize timer 
 */
// Gets formatted, current datetime
const datetime = () => moment().format('MMMM Do YYYY, h:mm:ss a')
// Gets element
const datetimeEl = $('#datetime').find('.display')
// Initial datetime
datetimeEl.text(datetime())
// Sets text every second
setInterval(() => {
  datetimeEl.text(datetime())
}, 1000);

/**
 * Initialize form
 */
const modalEl = $('#formModal')
const formEl = $('#projectForm')
const tableEl = $('.table')
formEl.on('submit', handleFormSubmission)
function getValues() {
  const values = {}
  for (let el of formEl.find('input, select')) {
    values[$(el).attr('id')] = el.value
  }
  return values
}
function handleFormSubmission(ev) {
  ev.preventDefault()
  createNewTableRow(getValues())
  formEl[0].reset()
  modalEl.modal('hide')
}

function createNewTableRow({ projectName, projectType, dueDate, hourlyRate }) {
  const daysLeft = moment(dueDate, 'YYYY-MM-DD').diff(moment(), 'days')
  const newRow = $(`<tr>
    <th scope="row">${projectName}</th>
    <td>${projectType}</td>
    <td>$${hourlyRate}</td>
    <td>${dueDate}</td>
    <td>${daysLeft}</td>
    <td>${daysLeft * hourlyRate * 8}</td>
    <td><button class='btn btn-danger'>&times;</button></td>
  </tr>`)
  newRow.find('button').on('click', () => newRow.remove())
  tableEl.find('tbody').append(newRow)

}
const submitBtn = modalEl.find('.btn-primary').on('click', handleFormSubmission)

/**
 * Initialize table
 */