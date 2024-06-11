from django.db import models


# Create your models here.
class userFiles(models.Model):
    user = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    s3_file_id = models.CharField(unique=True, max_length=100)
    file_name = models.CharField(max_length=100)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name + " - " + self.user.username
