# Generated by Django 4.2.13 on 2024-06-10 12:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_alter_userfiles_s3_file_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userfiles',
            name='s3_file_id',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]