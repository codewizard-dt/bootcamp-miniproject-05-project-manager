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
  createProject(getValues())
  formEl[0].reset()
  modalEl.modal('hide')
}

/**
 * Formats any number as dollars.
 * @param {*} num any number
 * @returns string formatted as currency
 */
const currencyFormat = num => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num)

/**
 * Determines the next sequential id for a project.
 * @returns a number
 */
function getNextId() {
  return Projects.length ? Projects[Projects.length - 1].id + 1 : 1
}

/**
 * Saves projects to local storage.
 * @param {object} project optional project to add to data
 */
function saveProjects(project) {
  if (project) Projects.push({ ...project, id: getNextId() })
  localStorage.setItem('projects', JSON.stringify(Projects))
}
/**
 * Receives a row and deletes the project that is represented by that row.
 * @param {jQuery} rowEl row within the table
 */
function removeProject(ev) {
  const { target } = ev
  const { rowEl } = $(target).data()
  const { project } = rowEl.data()
  Projects = Projects.filter(project => project.id !== rowEl.data('project').id)
  saveProjects()
  rowEl.remove()
  $('#deletionModal').modal('hide')
}
/**
 * Attach delete click listener
 */
$('#deletionModal').find('.btn-danger').on('click', removeProject)

/**
 * Adds a row to the table.
 * Adds the project to localStorage if not already included.
 * @param {object} project 
 */
function createProject(project) {
  const { projectName, projectType, dueDate, hourlyRate } = project
  const daysLeft = moment(dueDate, 'YYYY-MM-DD').diff(moment(), 'days')
  const newRow = $(`<tr>
    <th scope="row">${projectName}</th>
    <td>${projectType}</td>
    <td>${currencyFormat(hourlyRate)}</td>
    <td>${dueDate}</td>
    <td>${daysLeft}</td>
    <td>${currencyFormat(daysLeft * hourlyRate * 8)}</td>
    <td><button type='button' data-toggle='modal' data-target='#deletionModal' class='btn btn-danger'>&times;</button></td>
  </tr>`)
  /** Add additional listener to button that adds the `rowEl` and `project` as data to the button in the modal */
  newRow.find('.btn-danger').on('click', () => $('#deletionModal').find('.btn-danger').data({ rowEl: newRow, project }))
  tableEl.find('tbody').append(newRow)
  /** Adds project to localStorage */
  if (!project.id) saveProjects(project)
}
const submitBtn = modalEl.find('.btn-primary').on('click', handleFormSubmission)

/**
 * Get data from local storage
 */
const storedProjects = localStorage.getItem('projects')
let Projects = storedProjects ? JSON.parse(storedProjects) : []
/**
 * Initialize table with stored projects
 */
for (let project of Projects) {
  createProject(project)
}
