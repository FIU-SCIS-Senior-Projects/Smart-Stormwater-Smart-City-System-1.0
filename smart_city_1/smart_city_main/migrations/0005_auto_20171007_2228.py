# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-10-08 02:28
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('smart_city_main', '0004_auto_20171007_2105'),
    ]

    operations = [
        migrations.RenameField(
            model_name='device',
            old_name='bettery_level',
            new_name='battery_level',
        ),
    ]