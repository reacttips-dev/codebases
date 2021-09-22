import type Todo from '../schema/Todo';
import TaskImportance from '../schema/TaskImportance';
import { getGuid } from 'owa-guid';

export function createTodo(partialTodo: Partial<Todo>): Todo {
    partialTodo = partialTodo !== null ? partialTodo : {};
    const todoId = partialTodo.Id ? partialTodo.Id : getGuid();
    return {
        ...partialTodo,
        __type: 'Todo',
        Id: todoId,
        ParentFolderId: partialTodo.ParentFolderId ? partialTodo.ParentFolderId : null,
        Subject: partialTodo.Subject ? partialTodo.Subject : null,
        ReminderDateTime: partialTodo.ReminderDateTime ? partialTodo.ReminderDateTime : null,
        IsReminderOn: partialTodo.IsReminderOn ? partialTodo.IsReminderOn : false,
        CompletedDateTime: partialTodo.CompletedDateTime ? partialTodo.CompletedDateTime : null,
        DueDateTime: partialTodo.DueDateTime ? partialTodo.DueDateTime : null,
        OrderDateTime: partialTodo.OrderDateTime ? partialTodo.OrderDateTime : null,
        Status: partialTodo.Status ? partialTodo.Status : 'NotStarted',
        Subtasks: partialTodo.Subtasks ? partialTodo.Subtasks : null,
        Importance: partialTodo.Importance ? partialTodo.Importance : TaskImportance.Normal,
        Note: partialTodo.Note ? partialTodo.Note : null,
        LinkedEmail: partialTodo.LinkedEmail ? partialTodo.LinkedEmail : null,
        CommittedDay: partialTodo.CommittedDay ? partialTodo.CommittedDay : null,
        CommittedOrder: partialTodo.CommittedOrder ? partialTodo.CommittedOrder : null,
        PostponedDay: partialTodo.PostponedDay ? partialTodo.PostponedDay : null,
        CreatedWithLocalId: todoId,
    };
}
