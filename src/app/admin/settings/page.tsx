export const dynamic = 'force-dynamic';

export default function AdminSettingsPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
        <p className="text-gray-500">Базовые настройки админки и подсказки по секретам</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Секреты и окружение</h2>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Ключи и токены хранить только в GitHub Secrets / .env на сервере.</li>
          <li>Для новых интеграций добавляйте переменные в .env, не коммитя значения.</li>
          <li>Файлы загрузок сохраняются локально в `UPLOAD_DIR`.</li>
        </ul>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Что дальше</h2>
        <p className="text-sm text-gray-700">
          Здесь можно добавить управление общими настройками (брендинг, контактные данные, уведомления) и безопасностью
          (API-ключи, блокировки пользователей). Пока это заглушка для дальнейшей доработки.
        </p>
      </div>
    </div>
  );
}
