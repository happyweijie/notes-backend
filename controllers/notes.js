const Note = require('../models/note')
const notesRouter = require('express').Router()

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})

  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

notesRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
  // note: express automatically calls error-handling middleware
  // no need for .catch((error) => next(error))

  /*
  // old
  note.save()
    .then((savedNote) => {
      response.json(savedNote)
    })
    .catch((error) => next(error))
  */
})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)

  response.status(204).end()
})

notesRouter.put('/:id', async (request, response) => {
  const { content, important } = request.body

  const note = await Note.findById(request.params.id)
  if (!note) {
    response.status(404).end()
  }

  // update note fields
  note.content = content
  if (important) {
    note.important = important
  }

  const updatedNote = await note.save()
  response.json(updatedNote)
})


module.exports = notesRouter