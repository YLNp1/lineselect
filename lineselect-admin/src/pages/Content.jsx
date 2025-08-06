const Content = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage static content for your website pages
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Content Management</h3>
          <p className="text-gray-500 mb-4">
            Content management functionality will be available in the next version.
          </p>
          <p className="text-sm text-gray-400">
            This will allow you to edit homepage banners, about page content, and other static text.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Content;