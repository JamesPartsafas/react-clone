//This file is the one directly called by index.html and that calls necessary render functions

import { render } from './CustomReact.js'
import Component from './Component.js'

const root = document.getElementById('root')
const root2 = document.getElementById('root-2')
let propCount = 0

document.getElementById('btn-prop').addEventListener('click', () => {
    propCount++
    renderComponent()
})

const renderComponent = () => {
    render(Component, { propCount, buttonElem: document.getElementById('btn-count') }, root)
    render(Component, { propCount, buttonElem: document.getElementById('btn-count-2') }, root2)
}

renderComponent()