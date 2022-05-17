import pip

if hasattr(pip, 'main'):
    pip.main(['install', "tensorflow-cpu"])
else:
    pip._internal.main(['install', "tensorflow-cpu"])

from insert_news import insert_news

insert_news()
