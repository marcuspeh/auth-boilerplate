import React from 'react'
import { TodoModel } from '../../models/todoModel'
import { ViewType } from '../../models/viewType'
import { formatDate } from '../../utilities/dateFormatter'
import NoTask from './noTask'
import TodoCard from './todoCard'

interface Prop {
    data: TodoModel[]
    viewMode: ViewType
}

const TodoList: React.FC<Prop> = (prop: Prop): JSX.Element => {
    const { data, viewMode, ...rest } = prop
    
    if (data && data.length > 0) {
        const dataMap = data.map((todo) => {
            return <TodoCard key={todo.id} title={todo.title} body={todo.task} viewMode={viewMode}
                date={formatDate(todo.updatedAt)} todoId={todo.id} isDone={todo.isDone} />
        })
        return (<>{dataMap}</>)
    } else {
        return <NoTask />
    }
}

export default TodoList;