import { render } from './MyReact.js'
import Component from './Component.js'

const root = document.getElementById('root')
let propCount = 0

document.getElementById('btn-prop').addEventListener('click', () => {
    propCount++
    renderComponent()
})

const renderComponent = () => {
    render(Component, { propCount }, root)
}

renderComponent()