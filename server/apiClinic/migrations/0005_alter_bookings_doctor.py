# Generated by Django 5.0 on 2023-12-17 23:42

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apiClinic', '0004_alter_bookings_patient'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bookings',
            name='doctor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apiClinic.doctor'),
        ),
    ]
