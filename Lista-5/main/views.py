from django.shortcuts import redirect, render
from django.views import View
from main.models import userFiles
from main.utils import upload_file, delete_file
from django.contrib import messages
import uuid
import environ
from django.http import FileResponse
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
import boto3
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User


env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False)
)

def logout_view(request):
    logout(request)
    return redirect("main")

class MainView(View):
    def get(self, request):
        return render(request, "main.html")

class LoginView(View):
    def get(self, request):
        return render(request, "login.html")
    
    def post(self, request):
        data = request.POST
        username = data.get("username")
        password = data.get("password")
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect("userFiles")
        else:
            messages.error(request, "Invalid credentials")
            return redirect("login")
    
class RegisterView(View):
    def get(self, request):
        return render(request, "register.html")
    
    def post(self, request):
        
        data = request.POST
        username = data.get("username")
        password = data.get("password")
        password2 = data.get("password2")
        
        if not username or not password or not password2:
            messages.error(request, "All fields are required")
            return redirect("register")
        
        if password != password2:
            messages.error(request, "Passwords do not match")
            return redirect("register")
        
        if len(password) < 8:
            messages.error(request, "Password must be at least 8 characters")
            return redirect("register")
        
        if User.objects.filter(username=username).exists():
            messages.error(request, "Username is taken")
            return redirect("register")
        
        User.objects.create_user(username=username, password=password)
        messages.success(request, "Account created successfully")
        return redirect("login")

@method_decorator(login_required, name="dispatch")
class UserFilesView(View):

    def get(self, request):
        user_files = userFiles.objects.filter(user=request.user)

        return render(request, "userFiles.html", {"user_files": user_files})

    def post(self, request):
        data = request.POST
        file = request.FILES.get("file")
        file_exptension = file.name.split(".")[-1]
        name = data.get("fileName") + f".{file_exptension}"
        s3_file_id = str(uuid.uuid4())
        if not data.get("fileName") and not file:
            messages.error(request, "File and File Name are required")
            return redirect("userFiles")

        if upload_file(
            file, env("AWS_BUCKET_NAME"), s3_file_id + f".{file_exptension}"
        ):
            userFiles.objects.create(
                user=request.user,
                file_name=name,
                s3_file_id=s3_file_id + f".{file_exptension}",
            )
            messages.success(request, "File uploaded successfully")
        else:
            messages.error(request, "Error uploading file")

        return redirect("userFiles")


@login_required
def delete_file_view(request, file_id):
    file = get_object_or_404(userFiles, s3_file_id=file_id, user=request.user)
    if delete_file(env("AWS_BUCKET_NAME"), file_id):
        file.delete()
        messages.success(request, "File deleted successfully")
    else:
        messages.error(request, "Error deleting file")

    return redirect("userFiles")


@login_required
def download_file_view(request, file_id):
    file = get_object_or_404(userFiles, s3_file_id=file_id, user=request.user)
    s3_connection = boto3.Session(
        aws_access_key_id=env("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=env("AWS_SECRET_ACCESS_KEY"),
        aws_session_token=env("AWS_SESSION_TOKEN"),
        region_name=env("AWS_REGION"),
    )
    s3 = s3_connection.resource("s3")
    obj = s3.Object(env("AWS_BUCKET_NAME"), file_id)
    response = FileResponse(obj.get()["Body"])
    response["Content-Disposition"] = f"attachment; filename={file.file_name}"
    return response

@login_required
@require_http_methods(["POST"])
def edit_file_name_view(request, file_id):
    new_file_name = request.POST.get("newFileName")
    if not new_file_name:
        messages.error(request, "New File Name is required")
        return redirect("userFiles")
    file = get_object_or_404(userFiles, s3_file_id=file_id, user=request.user)
    old_extension = file.file_name.split(".")[-1]
    new_file_name = new_file_name + f".{old_extension}"
    file.file_name = new_file_name
    file.save()
    messages.success(request, "File name updated successfully")
    return redirect("userFiles")