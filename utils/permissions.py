from django.shortcuts import redirect

def admin_login(view_func):
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_superuser:
            return redirect('admin_user:no_permission')
        return view_func(request, *args, **kwargs)

    return _wrapped_view
