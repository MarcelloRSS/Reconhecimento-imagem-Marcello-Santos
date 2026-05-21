// =============================================
// DB: Simulado via localStorage
// Estrutura: { users: [], todos: [] }
// =============================================

const DB = {
    init() {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }
        if (!localStorage.getItem('todos')) {
            localStorage.setItem('todos', JSON.stringify([]));
        }
    },
    getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    },
    saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    },
    getTodos() {
        return JSON.parse(localStorage.getItem('todos')) || [];
    },
    saveTodos(todos) {
        localStorage.setItem('todos', JSON.stringify(todos));
    },
    getUserByEmail(email) {
        return this.getUsers().find(u => u.email === email.toLowerCase());
    },
    createUser({ name, email, password }) {
        const users = this.getUsers();
        const newUser = {
            id: Date.now().toString(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
        };
        users.push(newUser);
        this.saveUsers(users);
        return newUser;
    },
    getTodosByUser(userId) {
        return this.getTodos().filter(t => t.userId === userId);
    },
    createTodo({ userId, title, type, description }) {
        const todos = this.getTodos();
        const newTodo = {
            id: Date.now().toString(),
            userId,
            title: title.trim(),
            type,
            description: description.trim(),
            done: false,
            createdAt: new Date().toISOString(),
        };
        todos.push(newTodo);
        this.saveTodos(todos);
        return newTodo;
    },
    toggleTodo(todoId) {
        const todos = this.getTodos();
        const idx = todos.findIndex(t => t.id === todoId);
        if (idx === -1) return;
        todos[idx].done = !todos[idx].done;
        this.saveTodos(todos);
        return todos[idx];
    },
    deleteTodo(todoId) {
        const todos = this.getTodos().filter(t => t.id !== todoId);
        this.saveTodos(todos);
    }
};

// =============================================
// SESSION
// =============================================

const Session = {
    get() {
        return JSON.parse(localStorage.getItem('currentUser'));
    },
    set(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    },
    clear() {
        localStorage.removeItem('currentUser');
    }
};

// =============================================
// UI HELPERS
// =============================================

let currentFilter = 'all';

const Views = {
    login: document.getElementById('login-view'),
    register: document.getElementById('register-view'),
    app: document.getElementById('app-view'),
};

function showView(name) {
    Object.entries(Views).forEach(([key, el]) => {
        if (key === name) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });
}

function showError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
}

function hideError(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = '';
    el.classList.add('hidden');
}

function clearFormErrors(ids) {
    ids.forEach(hideError);
}

// =============================================
// BADGE CONFIG
// =============================================

const TYPE_CONFIG = {
    trabalho: {
        label: 'Trabalho',
        classes: 'bg-blue-500/15 text-blue-300 border border-blue-500/20',
    },
    pessoal: {
        label: 'Pessoal',
        classes: 'bg-violet-500/15 text-violet-300 border border-violet-500/20',
    },
    estudos: {
        label: 'Estudos',
        classes: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20',
    },
};

// =============================================
// RENDER TODOS
// =============================================

function renderTodos() {
    const user = Session.get();
    const listEl = document.getElementById('todo-list');
    const emptyEl = document.getElementById('empty-state');
    const statsEl = document.getElementById('todo-stats');

    let todos = DB.getTodosByUser(user.email);

    const total = todos.length;
    const done = todos.filter(t => t.done).length;
    const pending = total - done;

    if (statsEl) {
        statsEl.textContent = `${pending} pendente${pending !== 1 ? 's' : ''} · ${done} concluida${done !== 1 ? 's' : ''}`;
    }

    // Filtro
    if (currentFilter === 'pending') {
        todos = todos.filter(t => !t.done);
    } else if (currentFilter === 'done') {
        todos = todos.filter(t => t.done);
    }

    // Ordenar: pendentes primeiro
    todos.sort((a, b) => {
        if (a.done === b.done) return new Date(b.createdAt) - new Date(a.createdAt);
        return a.done ? 1 : -1;
    });

    listEl.innerHTML = '';

    if (todos.length === 0) {
        emptyEl.classList.remove('hidden');
        return;
    }

    emptyEl.classList.add('hidden');

    todos.forEach(todo => {
        const config = TYPE_CONFIG[todo.type] || TYPE_CONFIG.trabalho;
        const card = document.createElement('div');
        card.className = `todo-card rounded-xl p-4 animate-slide-up ${todo.done ? 'done' : ''}`;
        card.dataset.id = todo.id;

        card.innerHTML = `
            <div class="flex items-start justify-between gap-3">
                <div class="flex items-start gap-3 min-w-0">
                    <button
                        class="complete-btn mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 ${todo.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 hover:border-blue-500'} transition-all flex items-center justify-center"
                        data-id="${todo.id}"
                        title="${todo.done ? 'Desfazer' : 'Concluir'}"
                    >
                        ${todo.done ? `<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>` : ''}
                    </button>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center flex-wrap gap-2 mb-1">
                            <p class="text-sm font-medium text-white ${todo.done ? 'line-through text-slate-500' : ''} truncate">${escapeHtml(todo.title)}</p>
                            <span class="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${config.classes}">${config.label}</span>
                        </div>
                        ${todo.description ? `<p class="text-xs text-slate-400 mt-1 leading-relaxed">${escapeHtml(todo.description)}</p>` : ''}
                    </div>
                </div>
                <button
                    class="delete-btn flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    data-id="${todo.id}"
                    title="Excluir tarefa"
                >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        `;

        listEl.appendChild(card);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

// =============================================
// APP INIT
// =============================================

function initApp() {
    const user = Session.get();
    if (!user) {
        showView('login');
        return;
    }
    document.getElementById('user-greeting').textContent = user.name.split(' ')[0];
    showView('app');
    currentFilter = 'all';
    setActiveFilter('all');
    renderTodos();
}

// =============================================
// EVENTOS: NAVEGACAO
// =============================================

document.getElementById('link-to-register').addEventListener('click', e => {
    e.preventDefault();
    clearFormErrors(['login-email-error', 'login-password-error', 'login-general-error']);
    document.getElementById('login-form').reset();
    showView('register');
});

document.getElementById('link-to-login').addEventListener('click', e => {
    e.preventDefault();
    clearFormErrors(['register-name-error', 'register-email-error', 'register-password-error', 'register-general-error']);
    document.getElementById('register-form').reset();
    showView('login');
});

document.getElementById('logout-btn').addEventListener('click', () => {
    Session.clear();
    document.getElementById('login-form').reset();
    clearFormErrors(['login-email-error', 'login-password-error', 'login-general-error']);
    showView('login');
});

// =============================================
// EVENTOS: AUTENTICACAO
// =============================================

document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    clearFormErrors(['login-email-error', 'login-password-error', 'login-general-error']);

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    let ok = true;

    if (!email) {
        showError('login-email-error', 'O e-mail e obrigatorio.');
        ok = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        showError('login-email-error', 'Digite um e-mail valido.');
        ok = false;
    }
    if (!password) {
        showError('login-password-error', 'A senha e obrigatoria.');
        ok = false;
    }
    if (!ok) return;

    const user = DB.getUserByEmail(email);
    if (!user) {
        showError('login-general-error', 'E-mail nao cadastrado. Crie uma conta.');
        return;
    }
    if (user.password !== password) {
        showError('login-general-error', 'Senha incorreta. Tente novamente.');
        return;
    }

    Session.set(user);
    document.getElementById('login-form').reset();
    initApp();
});

document.getElementById('register-form').addEventListener('submit', e => {
    e.preventDefault();
    clearFormErrors(['register-name-error', 'register-email-error', 'register-password-error', 'register-general-error']);

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;

    let ok = true;

    if (!name || name.length < 2) {
        showError('register-name-error', 'Informe um nome valido (minimo 2 caracteres).');
        ok = false;
    }
    if (!email) {
        showError('register-email-error', 'O e-mail e obrigatorio.');
        ok = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        showError('register-email-error', 'Digite um e-mail valido.');
        ok = false;
    }
    if (!password) {
        showError('register-password-error', 'A senha e obrigatoria.');
        ok = false;
    } else if (password.length < 6) {
        showError('register-password-error', 'A senha deve ter pelo menos 6 caracteres.');
        ok = false;
    }
    if (!ok) return;

    if (DB.getUserByEmail(email)) {
        showError('register-general-error', 'Este e-mail ja esta cadastrado.');
        return;
    }

    const newUser = DB.createUser({ name, email, password });
    Session.set(newUser);
    document.getElementById('register-form').reset();
    initApp();
});

// =============================================
// EVENTOS: TAREFAS
// =============================================

document.getElementById('todo-form').addEventListener('submit', e => {
    e.preventDefault();
    clearFormErrors(['todo-title-error']);

    const title = document.getElementById('todo-title').value.trim();
    const type = document.getElementById('todo-type').value;
    const description = document.getElementById('todo-description').value.trim();

    if (!title) {
        showError('todo-title-error', 'O titulo e obrigatorio.');
        return;
    }

    const user = Session.get();
    DB.createTodo({ userId: user.email, title, type, description });
    document.getElementById('todo-form').reset();
    renderTodos();

    // Feedback visual no botao
    const btn = document.getElementById('todo-submit');
    btn.textContent = 'Adicionada!';
    btn.classList.add('bg-emerald-600', 'hover:bg-emerald-500');
    btn.classList.remove('bg-blue-600', 'hover:bg-blue-500');
    setTimeout(() => {
        btn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Adicionar Tarefa
        `;
        btn.classList.remove('bg-emerald-600', 'hover:bg-emerald-500');
        btn.classList.add('bg-blue-600', 'hover:bg-blue-500');
    }, 1500);
});

// Delegacao de eventos na lista (concluir / excluir)
document.getElementById('todo-list').addEventListener('click', e => {
    const completeBtn = e.target.closest('.complete-btn');
    const deleteBtn = e.target.closest('.delete-btn');

    if (completeBtn) {
        const id = completeBtn.dataset.id;
        DB.toggleTodo(id);
        renderTodos();
    }

    if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        DB.deleteTodo(id);
        renderTodos();
    }
});

// =============================================
// EVENTOS: FILTROS
// =============================================

function setActiveFilter(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('bg-blue-600', 'text-white');
            btn.classList.remove('bg-slate-800/60', 'text-slate-400');
        } else {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('bg-slate-800/60', 'text-slate-400');
        }
    });
}

document.getElementById('filter-btns').addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    currentFilter = btn.dataset.filter;
    setActiveFilter(currentFilter);
    renderTodos();
});

// =============================================
// BOOT
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    DB.init();
    initApp();
});
