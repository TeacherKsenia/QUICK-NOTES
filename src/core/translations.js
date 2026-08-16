(function(global){
'use strict';
const catalog=[['Home','На главную'],['Workspace','Рабочее пространство'],['Quick notes on the go','Быстрые заметки на ходу'],['Search notes and people','Поиск заметок и учеников'],['STUDENTS','УЧЕНИКИ'],['GROUPS','ГРУППЫ'],['Add student or group','Добавить ученика или группу'],['Stored locally','Хранится локально'],['This demo never sends your data','Данные никуда не отправляются'],['Settings','Настройки'],['Lesson mode','Режим урока'],['Add note','Добавить заметку'],['All notes','Все заметки'],['Vocabulary','Лексика'],['Grammar','Грамматика'],['Errors','Ошибки'],['Interests','Интересы'],['Other / Ideas','Другое / Идеи'],['General','Основное'],['Workspace name','Название пространства'],['Language','Язык'],['Categories','Категории'],['Add category','Добавить категорию'],['Design','Дизайн'],['Theme','Тема'],['Font size','Размер шрифта'],['Standard','Стандартный'],['Large','Крупный'],['Extra large','Очень крупный'],['Data & Backup','Данные и резервная копия'],['Export backup','Экспортировать'],['Restore backup','Восстановить'],['Reset all data','Удалить все данные'],['Save settings','Сохранить настройки'],['Cancel','Отмена'],['Choose workspace avatar','Выбрать аватар'],['Remove','Удалить'],['Show all','Показать все'],['Newest first','Сначала новые'],['Oldest first','Сначала старые'],['Edit profile','Изменить профиль'],['Delete profile','Удалить профиль'],['Edit note','Изменить заметку'],['Move category','Перенести категорию'],['Move to…','Переместить в…'],['Delete note','Удалить заметку'],['Undo','Отменить']];
catalog.push(['Web demo','Веб-демо'],['Saved in this browser only','Хранится только в этом браузере'],['Your data is stored in this browser','Данные хранятся в этом браузере'],["Notes, students and photos may be lost if you clear this browser's site data. Use the desktop app for reliable storage on your computer.",'Заметки, ученики и фотографии могут исчезнуть при очистке данных сайта. Для надёжного хранения на компьютере используйте desktop-приложение.'],['Desktop app · Coming soon','Desktop-приложение · Скоро'],['Continue in web demo','Продолжить в веб-демо']);
catalog.push(['Web demo · Saved in this browser only','Веб-демо · Хранится только в этом браузере']);
catalog.push(['Midnight Focus','Полуночный фокус']);
catalog.push(['Night Forest','Ночной лес']);
catalog.push(
 ['⚙ Settings','⚙ Настройки'],['✦ Lesson mode','✦ Режим урока'],
 ['＋ Add note','＋ Добавить заметку'],['+ Add note','+ Добавить заметку'],
 ['＋ Add note for','＋ Добавить заметку для'],['+ Add note for','+ Добавить заметку для'],
 ['＋ Add category','＋ Добавить категорию'],['+ Add category','+ Добавить категорию'],
 ['＋ Add student','＋ Добавить ученика'],['+ Add student','+ Добавить ученика'],
 ['＋ Add group note','＋ Добавить заметку группы'],['+ Add group note','+ Добавить заметку группы'],
 ['Categories are shared by every student and group.','Категории общие для всех учеников и групп.'],
 ['Adjust the appearance of your workspace.','Настройте внешний вид рабочего пространства.'],
 ['Keep a local copy of your workspace data.','Сохраните локальную копию данных рабочего пространства.'],
 ['Minimalism','Минимализм'],['English','Английский'],
 ['EDIT STUDENT','РЕДАКТИРОВАНИЕ УЧЕНИКА'],['NEW STUDENT','НОВЫЙ УЧЕНИК'],
 ['Edit student','Редактировать ученика'],['Add a student','Добавить ученика'],
 ['Replace photo','Заменить фото'],['Choose photo','Выбрать фото'],
 ['JPG, PNG or WebP. Stored locally.','JPG, PNG или WebP. Хранится локально.'],
 ['Name','Имя'],['Short description','Краткое описание'],['optional','необязательно'],
 ['Delete student','Удалить ученика'],['Save changes','Сохранить изменения'],['Add student','Добавить ученика'],['Add profile','Добавить профиль'],
 ['EDIT GROUP','РЕДАКТИРОВАНИЕ ГРУППЫ'],['NEW GROUP','НОВАЯ ГРУППА'],
 ['Edit group','Редактировать группу'],['Create a group','Создать группу'],['Create group','Создать группу'],
 ['Group name','Название группы'],['Members','Участники'],['Delete group','Удалить группу'],
 ['WORKSPACE','РАБОЧЕЕ ПРОСТРАНСТВО'],['Drag to reorder','Перетащите для изменения порядка'],
 ['Category name','Название категории'],['Close','Закрыть'],['Remove photo','Удалить фото'],
 ['UNSAVED CHANGES','НЕСОХРАНЁННЫЕ ИЗМЕНЕНИЯ'],['Save your changes?','Сохранить изменения?'],
 ['You have changed your workspace settings.','Настройки рабочего пространства были изменены.'],
 ['Keep editing','Продолжить редактирование'],['Discard','Не сохранять'],
 ['Individual student','Индивидуальный ученик'],['Group','Группа'],['Student','Ученик'],['Individual','Ученик'],
 ['Last updated','Обновлено'],['Notes for','Заметки для'],['Member of','Состоит в'],
 ['Whole group','Вся группа'],['No notes yet','Заметок пока нет'],
 ['Capture an observation here.','Добавьте наблюдение сюда.'],
 ['Today','Сегодня'],['Yesterday','Вчера'],['days ago','дней назад'],['day ago','день назад'],
 ['note','заметка'],['notes','заметок'],['member','участник'],['members','участников'],
 ['Settings saved','Настройки сохранены'],['Profile deleted','Профиль удалён'],
 ['Student updated','Данные ученика обновлены'],['Group updated','Данные группы обновлены'],
 ['Note added','Заметка добавлена'],['Note updated','Заметка обновлена'],['Note deleted','Заметка удалена'],['Note restored','Заметка восстановлена'],['Move undone','Перемещение отменено']
 ,['NEW NOTE','НОВАЯ ЗАМЕТКА'],['EDIT NOTE','РЕДАКТИРОВАНИЕ ЗАМЕТКИ'],['MOVE NOTE','ПЕРЕМЕЩЕНИЕ ЗАМЕТКИ'],
 ['Add an observation','Добавить наблюдение'],['Observation','Наблюдение'],['Delete','Удалить'],['Save note','Сохранить заметку'],
 ['Choose another category','Выберите другую категорию'],['DELETE CATEGORY','УДАЛЕНИЕ КАТЕГОРИИ'],
 ['Move notes first','Сначала переместите заметки'],['Move notes to','Переместить заметки в'],
 ['Delete category & notes','Удалить категорию и заметки'],['Move notes & delete','Переместить заметки и удалить']
);
catalog.push(
 ['SETTINGS','НАСТРОЙКИ'],['Back to settings','Назад к настройкам'],['Settings sections','Разделы настроек'],
 ['My Profile','Мой профиль'],['Note Categories','Категории заметок'],
 ['Avatar, workspace name & language','Аватар, название и язык'],['Shared categories for notes','Общие категории заметок'],
 ['Theme & font size','Тема и размер шрифта'],['Export, restore & reset','Экспорт, восстановление и сброс'],
 ['About note categories','О категориях заметок'],
 ['Empty categories can be hidden in the workspace of a specific student or group using the eye button.','Пустые категории можно скрыть в рабочем пространстве конкретного ученика или группы с помощью 👁.']
);
catalog.push(['Previous categories','Предыдущие категории'],['Next categories','Следующие категории'],['You can create up to 8 categories','Можно создать до 8 категорий'],['Maximum 8 categories','Максимум 8 категорий'],['Quick Note cannot be deleted','Quick Note нельзя удалить']);
catalog.push(['Quick capture','Быстрая запись'],['Student or group','Ученик или группа'],['Groups','Группы'],['Students','Ученики'],['Choose group','Выберите группу'],['Choose student','Выберите ученика'],['Choose student or group','Выбери ученика или группу'],['Find student or group…','Найти ученика или группу…'],['No matches','Ничего не найдено'],['No students yet','Пока нет учеников'],['No groups yet','Пока нет групп'],['No groups','Нет групп'],['No students','Нет учеников'],['Note about','Заметка о'],['Category','Категория'],['Note','Заметка'],['Whole group','Вся группа'],['Ready for your next note','Готово для следующей заметки']);
catalog.push(['YOUR TEACHING SPACE','ВАШЕ РАБОЧЕЕ ПРОСТРАНСТВО'],['Everything important','Всё важное'],['— one click away.','— в одном клике.'],['Personolised notes about students, groups and work-related matters that are always at hand.','Персонализированные заметки о студентах, группах и рабочих моментах, которые всегда под рукой.'],['WORKSPACE','РАБОЧЕЕ ПРОСТРАНСТВО'],['Students & notes','Ученики и заметки'],['Check or edit your notes','Проверьте или измените заметки'],['CAPTURE','БЫСТРАЯ ЗАПИСЬ'],['Quick note','Быстрая заметка'],['Add a new quick note','Добавьте быструю заметку'],['YOUR DAY','ВАШ ДЕНЬ'],['To-do list','Список дел'],['Keep your tasks in order','Держите задачи в порядке'],['LIVE CLASS','НА УРОКЕ'],['Lesson mode','Режим урока'],['Take notes during the lesson','Делайте заметки во время урока'],['LATEST NOTES','ПОСЛЕДНИЕ ЗАМЕТКИ'],['Open workspace','Открыть заметки'],['Desktop app · Coming soon','Десктоп-приложение · Скоро'],['To-do list is our next step','Список дел — наш следующий этап']);
catalog.push(
 ['Backup restored','Резервная копия восстановлена'],
 ['This is not a valid Teacher Notes backup','Файл не является корректной резервной копией QUICK NOTES'],
);
catalog.push(
 ['TO DO LIST','СПИСОК ДЕЛ'],['To Do List','Список дел'],['Students & notes','Ученики и заметки'],['TASKS','ЗАДАЧИ'],
 ['Task Lists','Списки задач'],['Quick View','Быстрый обзор'],['Today','Сегодня'],['Upcoming','Предстоящие'],['No Date','Без даты'],['All Tasks','Все задачи'],
 ['MY LISTS','МОИ СПИСКИ'],['Add list','Добавить список'],['No custom lists yet','Пока нет своих списков'],['Pin list','Закрепить список'],['Unpin list','Открепить список'],
 ['Write it down… Let it out…','Запиши задачу… Освободи голову…'],['Write it down…','Запиши задачу…'],['Enter','Enter'],['Active','Активные'],['All','Все'],['Completed','Выполненные'],['Task status','Статус задач'],['New list','Новый список'],
 ['TODAY','СЕГОДНЯ'],['UPCOMING','ПРЕДСТОЯЩИЕ'],['NO DATE','БЕЗ ДАТЫ'],['ALL TASKS','ВСЕ ЗАДАЧИ'],['View all','Показать все'],
 ['Nothing due today','На сегодня задач нет'],['No upcoming tasks','Предстоящих задач нет'],['No undated tasks','Задач без даты нет'],['No tasks yet','Задач пока нет'],['This list is empty','Этот список пуст'],
 ['EDIT TASK','РЕДАКТИРОВАНИЕ ЗАДАЧИ'],['Task details','Параметры задачи'],['Task','Задача'],['Due date','Дата'],['List','Список'],['No list','Без списка'],['Completed','Выполнено'],
 ['Delete','Удалить'],['Cancel','Отмена'],['Save task','Сохранить'],['NEW LIST','НОВЫЙ СПИСОК'],['Create a list','Создание списка'],['List name','Название списка'],['Create list','Создать список'],
 ['New task','Новая задача'],['Delete this task?','Удалить эту задачу?'],['Tomorrow','Завтра'],['Task added','Задача добавлена'],['Task updated','Задача обновлена'],['Task deleted','Задача удалена'],['List created','Список создан'],
 ['Web demo','Веб-демо'],['Saved in this browser only','Хранится только в этом браузере']
);

catalog.push(
 ['Search notes, students and groups','Поиск заметок, учеников и групп'],['Showing matches for','Результаты для'],
 ['Add group','Добавить группу'],['Create group','Создать группу'],['New list','Новый список'],
 ['Show empty categories','Показать пустые категории'],['Hide empty categories','Скрыть пустые категории'],
 ['Previous categories','Предыдущие категории'],['Next categories','Следующие категории'],
 ['Pin category','Закрепить категорию'],['Unpin category','Открепить категорию'],
 ['Keep this category visible','Оставить категорию видимой'],['Unpin this category','Открепить категорию'],
 ['Manage members','Управлять участниками'],['Add members','Добавить участников'],
 ['Edit profile','Изменить профиль'],['Open navigation','Открыть навигацию'],['Back to profile','К профилю'],
 ['Choose icon','Выбрать иконку'],['Choose category icon','Выбрать иконку категории'],['Quick Note icon','Иконка Quick Note'],
 ['Mark active','Вернуть в активные'],['Complete task','Выполнить задачу'],['Remove star','Убрать из избранного'],['Star task','В избранное'],['Note actions','Действия с заметкой'],['Choose icon for','Выбрать иконку для'],['Pencil','Карандаш'],['Text','Текст'],['Grammar','Грамматика'],['Alert','Внимание'],['Heart','Сердце'],['Idea','Идея'],['Bookmark','Закладка'],
 ['Animals','Животные'],['Clothes','Одежда'],['Book','Книга'],['Speech','Речь'],['Listening','Аудирование'],['Globe','Глобус'],['Flag','Флаг'],['Checklist','Список'],['Clock','Часы'],['Game','Игра'],['Music','Музыка'],['Person','Человек'],['Group','Группа'],['Star','Звезда'],['Trophy','Награда'],['Brain','Мозг'],['Rocket','Ракета']
);
catalog.push(['YOUR BOARD','ВАША ДОСКА'],['To Do Board','Доска дел'],['Lists and tasks at a glance','Списки и задачи перед глазами']);
catalog.push(
 ['TO DO BOARD','ДОСКА ДЕЛ'],['Current','Актуальное'],['Recent','Недавние'],['Pinned','Закреплённые'],['With deadline','С дедлайном'],['In focus','В фокусе'],['Single tasks','Задачи'],['All lists','Все списки'],
 ['Search…','Что ищем?'],['Clear search','Очистить поиск'],['Search lists and tasks','Поиск списков и задач'],['Lists','Списки'],['No lists here yet','Здесь пока нет списков'],['No single tasks here','Здесь пока нет задач'],['Nothing here yet','Здесь пока пусто'],['Empty list','Пустой список'],['done','выполнено'],
 ['Select','Выбрать'],['Selected','Выбрано'],['Select all','Выбрать все'],['Done','Готово'],['Move','Переместить'],['Nearest deadline','Ближайший дедлайн'],['Farthest deadline','Дальний дедлайн'],['Last activity','Последняя активность'],['Not used recently','Давно не использовались'],['Newest activity','Недавняя активность'],['Oldest activity','Давняя активность'],['Deadline first','Сначала с дедлайном'],
 ['NEW TASK','НОВАЯ ЗАДАЧА'],['Single task','Задача'],['What needs doing?','Что нужно сделать?'],['Deadline','Дедлайн'],['Add to focus ★','Добавить в фокус ★'],['Add task','Добавить задачу'],['EDIT LIST','РЕДАКТИРОВАНИЕ СПИСКА'],['Edit list','Редактировать список'],['Icon','Иконка'],['Calendar','Календарь'],['Pin this list','Закрепить список'],['Rename / edit','Переименовать / изменить'],['Change date','Изменить дату'],['List actions','Действия со списком'],['Task actions','Действия с задачей'],['Edit details','Изменить параметры'],['Add to focus','Добавить в фокус'],['Remove from focus','Убрать из фокуса'],['Task completed','Задача выполнена'],['List deleted','Список удалён'],
 ['Date','Дата'],['Task order','Порядок задач'],['Add task…','Добавить задачу…'],['Enter — next task · Shift+Enter — line break','Enter — следующая задача · Shift+Enter — перенос'],['Drag to reorder','Перетащите для изменения порядка'],
 ['Move selected notes','Переместить выбранные заметки'],['Pinned','Закреплено'],['Nothing in focus','В фокусе пока ничего нет']
);
catalog.push(['All data reset','Все данные удалены']);
catalog.push(['Install','Установить'],['Update','Обновить'],['Up to date','Актуальная версия'],['Open update','Открыть обновление'],['Checking…','Проверка…'],['Finding…','Поиск…'],['Open data folder','Открыть папку данных'],['Desktop app','Десктоп-приложение'],['Saved locally on this computer','Хранится локально на этом компьютере'],['Desktop app · Saved locally on this computer','Десктоп-приложение · Хранится локально на этом компьютере'],['Backup exported','Резервная копия сохранена'],['Could not export backup','Не удалось сохранить резервную копию'],['Could not restore backup','Не удалось восстановить резервную копию'],['You already have the latest version','У вас уже установлена последняя версия'],['Could not check for updates','Не удалось проверить обновления'],['Update downloaded','Обновление скачано'],['GitHub release is not configured yet','GitHub Release ещё не настроен'],['Installer is not available yet','Установщик пока недоступен'],['Install desktop app','Установить десктоп-приложение'],['Desktop app · Windows','Десктоп-приложение · Windows']);
catalog.push(['New single task','Новая задача'],['＋ New single task','＋ Новая задача']);
global.QuickNotesTranslations=Object.freeze(catalog.map(pair=>Object.freeze(pair)));
global.QuickNotesMessages=Object.freeze({
 deleteNote:Object.freeze({en:'Delete this note?',ru:'Удалить эту заметку?'}),
 categoryRequired:Object.freeze({en:'At least one category is required.',ru:'Должна остаться хотя бы одна категория.'}),
 deleteCategoryTitle:Object.freeze({en:'Delete {category}?',ru:'Удалить категорию «{category}»?'}),
 deleteCategoryCopy:Object.freeze({en:'This category contains {count} notes. Choose where they should be moved.',ru:'В этой категории {count} заметок. Выберите, куда их переместить.'}),
 deleteCategoryNotes:Object.freeze({en:'Permanently delete {count} notes in {category}? This cannot be undone after saving.',ru:'Навсегда удалить {count} заметок из категории «{category}»? После сохранения это действие нельзя отменить.'}),
 restoreBackup:Object.freeze({en:'Restore this backup? Current QUICK NOTES data will be replaced.',ru:'Восстановить эту резервную копию? Текущие данные QUICK NOTES будут заменены.'}),
 deleteProfile:Object.freeze({en:'Delete {name} and all {count} of its notes? This cannot be undone.',ru:'Удалить «{name}» и все заметки ({count})? Это действие нельзя отменить.'}),
 resetAllData:Object.freeze({en:'Delete all students, groups, notes and To Do data? Settings and categories will return to defaults.',ru:'Удалить всех учеников, группы, заметки и данные To Do? Настройки и категории вернутся к значениям по умолчанию.'})
});
})(window);
