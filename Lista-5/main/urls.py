from django.urls import path
from main.views import (
    UserFilesView,
    MainView,
    LoginView,
    RegisterView,
    delete_file_view,
    download_file_view,
    edit_file_name_view,
    logout_view,
)

urlpatterns = [
    path("", MainView.as_view(), name="main"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", logout_view, name="logout"),
    path("register/", RegisterView.as_view(), name="register"),
    path("userFiles/", UserFilesView.as_view(), name="userFiles"),
    path("deleteFile/<str:file_id>/", delete_file_view, name="deleteFile"),
    path("downloadFile/<str:file_id>/", download_file_view, name="downloadFile"),
    path("editFile/<str:file_id>/", edit_file_name_view, name="editFile"),
]
