var GitTern = require('../../../src/lib/core');
var config = require('../../../src/config');

describe('core', function(){
    it('constructor should create instance', function() {
        const spySubscribe = sinon.spy();
        const spySend = sinon.spy();
        const Adapter = {
            isCodePage: () => true,
            subscribe: spySubscribe,
            getFileContent: () => 'fileContent'
        }
        GitTern.prototype.send = spySend;
        const stub = sinon.stub().returns(Adapter)
        const root = {};
        new GitTern(root, stub, config);
        expect(stub.calledWithNew).to.be.ok;
        expect(spySubscribe.calledWith('click')).to.be.ok;
        expect(spySend.calledWith('register', {content: 'fileContent'})).to.be.ok;
    });

    it('#findDefinition ', function() {
        const line = 3;
        const ch = 5;
        const spyClean = sinon.spy();
        const spySend = sinon.spy();
        const mockAdapter = function () {
            return {
                isCodePage: () => false, // to prevent subscibe
                clean: spyClean,
                getElem: () => {},
                getLineNumber: () => line,
                getEndColumnPosition: () => ch
            };
        }

        GitTern.prototype.send = spySend;
        const root = {};
        var instance = new GitTern(root, mockAdapter, config);
        instance.findDefinition();

        expect(spyClean.calledOnce).to.be.ok;
        expect(spySend.calledWith(
            'definition',
            {
                type: 'definition',
                end: {line, ch},
                lineCharPositions: true,
                variable: null
            }
        )).to.be.ok;
    });

    it('#showRefs', function() {
        const spyShow = sinon.spy();
        const mockAdapter = function () {
            return {
                isCodePage: () => false,
                show: spyShow
            };
        }

        GitTern.prototype.send = () => null;
        const root = {};
        var instance = new GitTern(root, mockAdapter, config);

        const data = {refs: ['data1', 'data2']};
        instance.showRefs(data);

        expect(spyShow.calledTwice).to.be.ok;
        expect(spyShow.calledWith(data.refs[0])).to.be.ok;
        expect(spyShow.calledWith(data.refs[1])).to.be.ok;
    });

    it('#showDefinition ', function() {
        const spyShow = sinon.spy();
        const mockAdapter = function () {
            return {
                isCodePage: () => false,
                show: spyShow
            };
        }

        GitTern.prototype.send = () => null;
        const root = {};
        var instance = new GitTern(root, mockAdapter, config);

        const data = {start: 'start', end: 'end'};
        instance.showDefinition(data);

        expect(spyShow.calledOnce).to.be.ok;
        expect(spyShow.calledWith(data)).to.be.ok;
    });

    it('click + altKey should lead to findDefinition call', function() {
        const mockAdapter = function () {
            return {
                isCodePage: () => true,
                subscribe: ()=> null,
                clean: () => null,
                getFileContent: () => 'fileContent',
                getElem: () => {},
                getLineNumber: () => null,
                getEndColumnPosition: () => null
            };
        }

        GitTern.prototype.send = () => null;
        const root = {};
        const instance = new GitTern(root, mockAdapter, config);
        const stub = sinon.stub(instance, 'findDefinition');
        instance.clickHandler({});
        expect(stub.notCalled).to.be.ok;

        instance.clickHandler({});
        expect(stub.notCalled).to.be.ok;

        instance.clickHandler({altKey: true});
        expect(stub.calledOnce).to.be.ok;
    });
})
