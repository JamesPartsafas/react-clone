//This file contains implementations of React hooks and rendering

let globalId = 0 //Global ID is used to track which state variable is being called, and resets on rerender
let globalParent
const componentState = new Map()

export function useState(initialState) {
    const id = globalId
    const parent = globalParent
    globalId++

    //Closures are used to keep the globalParent variable scoped to the immediate caller, even on successive recalls
    return (() => {
        const { cache } = componentState.get(parent)

        //If cache[id] is null, it is the first time we are calling it
        if (cache[id] == null) {
            cache[id] = { 
                value: typeof initialState === 'function' ? initialState() : initialState,
            }
        }

        //setState gets returned in an array and allows user to pass values directly or functions to update values
        const setState = (state) => {
            const { props, component } = componentState.get(parent) //Get up-to-date props and component on every rerender
            if (typeof state === 'function') {
                cache[id].value = state(cache[id].value)
            }
            else {
                cache[id].value = state
            }

            render(component, props, parent)
        }

        return [cache[id].value, setState]
    })()
}

const dependencyChange = (cache, dependencies) => {
    return (
        dependencies == null || 
        dependencies.some((dependency, i) => {
            return (
                cache.dependencies == null || 
                cache.dependencies[i] !== dependency
            )
        })
    )
}

export function useEffect(callback, dependencies) {
    const id = globalId
    const parent = globalParent
    globalId++

    ;(() => {
        const { cache } = componentState.get(parent)

        //If cache[id] is null, it is the first time we are calling it
        if (cache[id] == null) {
            cache[id] = { 
                dependencies: undefined
            }
        }

        //Check if dependencies have changed
        const dependenciesChanged = dependencyChange(cache[id], dependencies)

        if (dependenciesChanged) {
            if (cache[id].cleanup != null)
                cache[id].cleanup()
            cache[id].cleanup = callback()
            cache[id].dependencies = dependencies
        }
    })()
}

export function useMemo(callback, dependencies) {
    const id = globalId
    const parent = globalParent
    globalId++

    return (() => {
        const { cache } = componentState.get(parent)

        //If cache[id] is null, it is the first time we are calling it
        if (cache[id] == null) {
            cache[id] = { 
                dependencies: undefined
            }
        }

        //Check if dependencies have changed
        const dependenciesChanged = dependencyChange(cache[id], dependencies)

        if (dependenciesChanged) {
            cache[id].value = callback()
            cache[id].dependencies = dependencies
        }

        return cache[id].value
    })()
}

export function render(component, props, parent) {
    const state = componentState.get(parent) || { cache: [] } //Get state from parent or default to empty array if state is not set
    componentState.set(parent, { ...state, component, props }) //spread operator puts in previous component and props, which may be overriden if current render has a different set passed in
    globalParent = parent
    const output = component(props)
    globalId = 0
    parent.textContent = output
}