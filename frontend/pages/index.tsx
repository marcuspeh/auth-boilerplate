import { useState, useEffect } from "react"
import { getUndone, getDone, getAll } from "../services/api/todoController"
import DropDown from "../components/atoms/dropDown"
import NavbarLayout from "../components/atoms/navbarLayout"
import TodoList from "../components/viewTodo/todoList"
import { TodoModel } from "../models/todoModel"
import { ViewType } from "../models/viewType"

async function getData(type: ViewType): Promise<TodoModel[]> {
    if (type == ViewType.VIEW_ALL) {
        return (await getAll()).data
    } else if (type == ViewType.VIEW_DONE) {
        return (await getDone()).data
    } else if (type == ViewType.VIEW_UNDONE) {
        return (await getUndone()).data
    } else {
        throw new Error("Not implemented")
    }
}

export default function Login(props: any) {
    const [data, setData] = useState<TodoModel[]>([])
    const [viewType, setViewType] = useState(ViewType.VIEW_UNDONE)

    useEffect(() => {
      (async () => {
        const result: TodoModel[] = await getData(viewType)
        setData(result)
      })()
    }, [viewType])
  
    function onViewTypeSelect(e: any): void {
      setViewType(e.target.value)
    }
          
    const reactElement = (<>
        <DropDown value={viewType} onClick={onViewTypeSelect} />
        <TodoList data={data} viewMode={viewType}/>
    </>)
    return (
        <>
            <NavbarLayout reactElement={reactElement} title={viewType} />
        </>
        )
  }